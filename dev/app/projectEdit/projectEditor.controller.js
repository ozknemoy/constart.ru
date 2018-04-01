/**
 * Created by дима on 30.08.2016.
 */
export class ProjectEditorController {

    constructor($rootScope, $timeout, $auth, $localStorage, $state, $filter, $uibModal,
                $location, httpFactory, Upload, countFactory, dictFactory, baseUrl,
                handleDataFactory, userFactory, ngToast,TYPE) {
        'ngInject';

        if (!$auth.isAuthenticated() || typeof $localStorage.user_id === "undefined") {
            $state.go('home');
            return
        }

        this.optionsExt = {
            height: '400',
            language: 'ru',
            allowedContent: true,// вроде теги всякие и подобное
            entities: false
        };
        // настройки для облегченой версии
        this.options = Object.assign({customConfig: 'config-lite.js'}, this.optionsExt);

        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$localStorage = $localStorage;
        this.baseImgUrl = httpFactory.baseImgUrl;
        this.baseDocUrl = httpFactory.baseDocUrl;
        this.httpDocUrl = httpFactory.httpDocUrl;
        this.baseUrl = baseUrl;
        this.countFactory = countFactory;
        this.dictFactory = dictFactory;
        this.handleDataFactory = handleDataFactory;
        this.httpFactory = httpFactory;
        this.Upload = Upload;
        this.state = $state.current.name.replace('projectEditor.','');//init
        this.userFactory = userFactory;
        this.ngToast = ngToast;
        this.$filter = $filter;
        this.TYPE = TYPE;



        this.isOdvf = TYPE === 'air';
        this.user_id = $localStorage.user_id;

        if ($state.params.id == 'new') {
            this.type_id = $location.search()['type_id'];//только у новых смотрю тут. потом в теле запроса
            this.id = 'new';
            this.initNewData();

        } else {
            this.id = typeof $state.params.id !== "undefined" ? parseInt($state.params.id) : 0;
            httpFactory.get('project/' + this.id + '/view?userId=' + this.user_id).then(d => {
                if (d.data.owner_id != this.user_id) {
                    $state.go('home');
                    return
                } else {
                    this.p = d.data;
// проверка на публикацию
                    if (this.p.status > 2) {
                        $state.go('home');
                        return
                    }
// проверяю устарел ли логин
                    if (this.p.relogin == 1) {
                        userFactory._reLogin();
                        return
                    }

                    this.initExistedData ();
                }
            }, e => {
                // редирект если логин устарел на этой машине
                if (!this.userFactory.reLogin(e)) {
                    $state.go('home')
                }
            })
        }

        $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams, options)=> {
            if (toState.url == "/budget") {// если страница смет то иницирую  их
                setTimeout(()=> {
                    this.initCells()
                }, 3000)
            }
            // чищу tiny данные от лишнего
            if (fromState.url == "/description") {
                for (var i = 1; i < 11; i++) {
                    this.p['descr_' + i] = handleDataFactory.cleanHTML(this.p['descr_' + i]);
                }
            }
        });


        this.getCountryAndRegion = function (cID, regID) {
            return handleDataFactory.getCountryAndRegion(cID, regID, this.geo);
        };
    }

    initNewData() {
        this.total = {};
        this.rewards = [];
        this.p = {
            type_id: this.type_id,
            projectTeamInvite: [],
            current_yield: [],
            estimate_monthly: [],
            estimate_capital: []
        };
        // для проектов со сбором денег
        if(this.type_id==1 || this.type_id==2) {
            var p = {
                investments_contract_tmpl_id: 1,
                loan_contract_tmpl_id: 1,
                found_payback_period: 6,
                found_period: 180,
                current_yield: [{item: "Прочие расходы", amount: "0", description: ""}]
            };
            Object.assign(this.p,p)
        }

        this.initCommonData ()
    }


    initExistedData() {

        this.httpFactory.get('reward/index?project_id=' + this.id).then(d=> {
            // ангуларовский сорт косячит при добавлении новых элементов
            this.r = d.data.sort((a, b) => {
                return a.price - b.price
            });
        });
        this.p.loan_payment_order = +this.p.loan_payment_order;
        this.initCommonData ();
        // todo это временный метод/ проверяю у существующих проектов наличие поля 'Прочие расходы'
        // удалить 1 сентября 2017
        this.check_current_yield();
        this.countSumTable('current_yield', 'founding_sum');
        this.countSumTable('estimate_monthly', 'estimate_monthly_total');
        this.countSumTable('estimate_capital', 'estimate_capital_total');
    }

    // todo это временный метод/ проверяю у существующих проектов наличие поля 'Прочие расходы'
    // удалить 1 сентября 2017
    check_current_yield() {
        if(this.p.current_yield.length && this.p.current_yield[0].item!=="Прочие расходы") {
            this.p.current_yield.splice(0,0,{item: "Прочие расходы", amount: "0", description: ""})
        }
    }

    initCommonData() {

        this.docs = this.dictFactory.pdf;
        this.isDirty = {};
        this.temp = {l: {}, t: {}};
        this.tempReward = {sell_count: 1};
        this.idCover = 'cover';
        this.idHeader = 'foto';

        this.pend = {};
        this.error = {};
        this.addUser = {};
        this.p.projectTeamInvite = this.p.projectTeamInvite || [];
        this.p.gallery = this.p.gallery ? this.p.gallery : [];
        this.temp.collResident = this.p.resident_id != null;
        this.temp.typePE = this.dictFactory.typePE;
        this.temp.incubators = this.dictFactory.incubators;
        this.temp.stages = this.dictFactory.stages;
        this.temp.legals = this.dictFactory.legals;
        this.temp.payment_order = this.dictFactory.payment_order;
        this.temp.payment_order_body = this.dictFactory.payment_order_body;
        this.httpFactory.get('user-legal/list').then(d=> {
            this.l = d.data;
            if (!this.l.length) return;
            this.l.forEach(item=> {// делаю удобоваримый вид для селекта
                item.name = item.data.ii_name || item.data.ur_name;
                // и если уже выбран юрик то
                if (this.p.user_legal_id == item.legal_type) {
                    this.legalsChanged(item);
                }
            });
        }, e => {
            this.userFactory.reLogin(e);
        });
        this.temp.selectLegals =
            (this.p.user_legal_id || this.p.is_need_create_legal || this.p.investments_found_sum) ? '1' : undefined;


        this.temp.collReward = this.p.reward_found_sum ? true : false;
        this.temp.collInv = this.p.investments_found_sum ? true : false;
        this.temp.collLoan = this.p.loan_found_sum ? true : false;
        if(this.p.type_id == 1) {// открываю колапс для кф
            this.temp.collReward = true;
        }
        this.httpFactory.getProjCategory().then(d => {
            if(this.TYPE === 'air') {
                this.p.category_id = 146;
                this.temp.category = d.data[0];
            } else if (this.p.category_id) {
                this.temp.category = this.handleDataFactory.getObjById(d.data, this.p.category_id)
            }
            if(this.temp.category) {
                this.temp.categoriesThirdLevel = _.where(this.temp.category.items,'id',this.p.category_sub_id).items;
            }
            this.$timeout(()=>this.temp.projCat = d.data);// для 3 уровнего списка иначе никак

        });
        this.httpFactory.getGeo().then(d=> {
            this.geo = d.data;
            this.changeCountry()
        });
        setTimeout(()=> {
            this.init();
        }, 2000)

    }

    changeCountry(changeFromHtml) {
        this.regionsOfContry = _.where(this.geo,'id',this.p.country_id).regions;
        if(changeFromHtml)this.p.region_id=null
    };

    checkLoanSum() {
        var isOk = this.p.loan_found_sum % 10 == 0;
        this.p.loan_found_sum = isOk ? this.p.loan_found_sum : this.$filter('myround')(this.p.loan_found_sum / 10, 0) * 10
    }

    setFotoUrl(id, value) {
        this.p[id] = value;
    }

    handleCategory() {
        this.p.category_sub_id=null;
        this.p.category_sub_sub_id=null;

    }

    handleSubCategory() {
        this.p.category_sub_sub_id=null;
        this.temp.categoriesThirdLevel = _.where(this.temp.category.items,'id',this.p.category_sub_id).items;
        this.temp.catThirdWithoutItems = !this.temp.categoriesThirdLevel;
    }

    tryChangeState(st) {
        if (st == this.state) return;

        if (this.id != 'new') {
            this.saveProject (this.id, st);

        } else {// создаю проект
            this.pend.save = 1;
            this.state = st;
            this.p.category_id = this.temp.category.id;

            this.httpFactory.post('project/create', this.p).then(d => {
                this.id = d.data.id;
                this.pend.save = 0;
                this.temp.saveError = 0;
                if (st) {
                    this.$state.go('projectEditor.' + st, {'id': this.id});
                }
            }, e => {
                this.pend.save = 0;
                this.temp.saveError = e.data.message;
            })
        }
    }

    saveProject(id = this.id, st) {
        this.pend.save = 1;
        const state = this.state;
        this.state = st ? st : state;
        this.p.category_id = this.temp.category.id;

        if(this.p.type_id == 1) {// для кф сумма сбора по кф = общей сумме сбора
            this.p.founding_sum = this.p.reward_found_sum;
        }

        // задерживаю из-за медленого обновления модели редакторов на 2 шаге
        setTimeout(()=> {
            this.httpFactory.put('project/' + id + '/update', this.p).then(d => {
                this.ngToast.info({dismissButton: true, content: 'Проект сохранен'});
                this.pend.save = 0;
                this.temp.saveError = 0;
                this.temp.saveSuccess = 1;
                this.$timeout(()=> {
                    this.temp.saveSuccess = 0;
                }, 5000);
                if (st) {
                    this.$state.go('projectEditor.' + st);
                }
            }, e => {
                this.pend.save = 0;
                this.temp.saveError = e.data.message;
            })
        }, state == 'desc' ? 1000 : 1)

    }

    prePublicate() {
        var err = [];

        if(this.p.type_id == 1 || this.p.type_id == 2) {
            if (this.temp.selectLegals == 1 && (!this.p.user_legal_id && !this.p.is_need_create_legal)) {
                err.push('Выберите ИП, юридическое лицо или закажите у нас оформление юридического лица')
            }

            if(this.p.type_id==2) {
                // for ki kl
                if (!this.p.founding_sum) {
                    err.push('Заполните необходимую сумму сбора')
                }
                if (this.p.founding_sum - this.p.own_money - this.p.investments_found_sum -
                    this.p.loan_found_sum - this.p.reward_found_sum != 0) {
                    err.push('Сумма всех сборов и необходимая сумма сбора должны совпадать')
                }
                if (!this.p.estimate_capital_total) {
                    err.push('Заполните планируемую выручку в месяц')
                }
                if (this.p.investments_dividends < 1) {
                    err.push('Ваша прибыль в месяц (выручка - операционные затраты) не может быть отрицательной')
                }

                // ki
                if (this.p.loan_found_sum > 0 && (!this.p.loan_interest_rate || !this.p.loan_period)) {
                    err.push('Заполните все поля краудлендинга')
                }
                if (this.p.investments_found_sum > 0 && (!this.p.investments_share || !this.p.investments_share_count)) {
                    err.push('Заполните все поля краудинвестинга')
                }
            }

            //kf
            if (this.p.reward_found_sum && this.p.reward_found_sum != 0 && !this.r.length) {
                err.push('Создайте хотя бы одно вознаграждение')
            }
            if (this.p.reward_found_sum < 1 && this.r.length) {
                err.push('Укажите какую сумму требуется собрать с помощью вознаграждений')
            }
        }

        // for all
        if (!this.p.owner.is_verified) {
            err.push('Необходимо верифицировать паспортные данные')
        }


        if (err.length) {
            this.temp.prePublicateError = err
        } else {
            // при повторном нажатии скидываю все ошибки
            this.temp.prePublicateError = [];
            this.publicate()
        }

    }

    publicate() {
        this.pend.save = 1;
        this.httpFactory.put('project/' + this.id + '/update', this.p).then(d => {
            this.httpFactory.put('project/' + this.id + '/send-to-moderate').then(d => {
                this.temp.publicateSuccess = 1;
                setTimeout(()=> {
                    this.$state.go('proj.about', {'id': this.id});
                }, 4000);
            }, e => {
                this.pend.save = 0;
                this.temp.publicateError = e.data.message;
            })
        }, e => {
            this.pend.save = 0;
            this.temp.saveError = e.data.message;
        })
    }

    clearCrowdinvesting() {
        this.temp.collInv = false;
        this.p.is_need_create_legal = null;
        this.p.user_legal_id = null;
        this.p.investments_found_sum = null;
        this.p.investments_share = null;
        this.p.investments_share_count = null;
        this.temp.legalType = undefined;
    }

    openModalFoto(id) {
        var b = angular.element('body').find('#_' + id);
        setTimeout(() => {
            b.click();//;triggerHandler('click') не работает
        }, 200);
    }

    deleteFotoFromGallery(index) {
        this.p.gallery.splice(index, 1)
    }

    /*только для галереи*/
    upload(file) {
        if (!file) return;
        if (this.p.gallery.length > 9) {
            this.error.limitGallery = 1;
            return
        }

        this.pend.uploadG = 1;
        this.Upload.upload({
                url: this.baseUrl + 'file/upload-gallery',
                data: {file: file}
            })
            .then(d => {
                this.pend.uploadG = 0;
                this.p.gallery.push({url: d.data.filename, thumbUrl: d.data.thumbname})
            }, (err) => {
                this.pend.uploadG = 0;
                this.error.uploadGallery = err.data.message || 0;
            }, (evt) => {
                //console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ' + evt.config.data.file.name);
            });
    };


    /*-----------------расчеты----------------*/

    // парсер ввода цифр смет todo теперь наверно можно удалить
    notN(num, key, i, type) {
        if (type == 'count') {
            this.p[key][i][type] = this.countFactory.notN(num);
        } else {
            this.p[key][i][type] = this.countFactory.notNWithPoint(num);
        }
    };

    countSumTable(key, keyAll) {
        if(this.p.type_id==3) return;
        this.p[keyAll] = 0;
        if (key === 'estimate_monthly') {
            this.p[key].forEach(item => {
                this.p[keyAll] += this.countFactory.notN(item.amount);
            })
        } else if(key === 'current_yield' ){ // ('current_yield','founding_sum')
            // во вью pe.p.current_yield_total = pe.p.founding_sum
            // первый элемент масива не считаем / это пункт прочее
            for (var i = 1; i < this.p[key].length; i++) {
                this.p[keyAll] += this.countFactory.notN(this.p[key][i].amount);
            }
            /*var tempAmount = this.countFactory.notN(this.p.investments_found_sum,this.p.loan_found_sum)
                - this.countFactory.notN(this.p.founding_sum);
            // в первую строку пишу значение кл+ки минус  итого таблицы
            this.p.current_yield[0].amount = isNaN(tempAmount)? 0:tempAmount;*/

            // в первую строку пишу значение кл+ки минус сумма таблицы, которая посчитана начиная со второй строчки)
            this.p.current_yield[0].amount = this.countFactory.notN(this.p.investments_found_sum,this.p.loan_found_sum)
                - this.countFactory.notN(this.p.founding_sum);
            //  плюсую первую строку в итого
            this.p[keyAll] += this.p.current_yield[0].amount;
        } else if(key === 'estimate_capital'){
            this.p[key].forEach(item => {
                this.p[keyAll] += this.countFactory.notN(item.amount * item.count);
            })
        }
        this.countInvest();
    }


    countInvest() {
        /*
         investments_found_sum требуется собрать crowdinvesting_need
         investments_share_count количество долей  xxxxxxxx
         investments_share  размер продаваемой доли  ci_total_sell_amount
         if(!this.p.investments_share_count||!this.p.investments_found_sum||!this.p.investments_share) return;

         // размер мин доли в %  this.temp.ci_min_sell_part_amount
         this.p.investments_min_share = this.p.investments_share/this.p.investments_share_count;

         // стоимость мин доли this.temp.ci_min_sell_part_amount_cost
         this.p.investments_min_cost = this.$filter('myround')(
         this.p.investments_found_sum*this.p.investments_min_share/this.p.investments_share,0,'math'
         );
         */
        if (!this.p.investments_share_count || !this.p.investments_min_cost || !this.p.investments_share) return;

        this.p.investments_found_sum = this.p.investments_share_count * this.p.investments_min_cost;
        // размер мин доли в %  this.temp.ci_min_sell_part_amount
        this.p.investments_min_share = this.p.investments_share / this.p.investments_share_count;


        // требуется собрать * размер мин доли в % / количество долей

        this.p.investments_dividends = this.p.estimate_capital_total - this.p.estimate_monthly_total;

        //Размер дивидендов на 1 минимальную долю в месяц
        var p1 = this.p.investments_dividends * (this.p.investments_min_share / 100);
        this.p.investments_min_dividends = isNaN(p1) ? 0 : p1;//this.temp.ci_dividend_for_min_sell_part_per_month


        //Общая выплата по дивидендам в мес
        this.temp.ci_total_dividend_amount_per_month = 100 * this.p.investments_dividends * this.p.investments_share;

        //Годовая доходность инвестиций
        this.temp.ci_invest_profit_per_year =
            100 * this.p.investments_min_dividends * 12 / this.p.investments_min_cost;

    }

    getTimeCoverExpend() {
        var intermed = parseFloat(this.p.current_yield_total / this.p.investments_dividends);
        if (isNaN(intermed) || intermed == 'Infinity') return undefined;
        else  return this.$filter('myround')(intermed + parseInt(this.p.found_payback_period), 0, 1)
    }

    addMoneyLine(type) {
        if (type != 'estimate_capital') {
            this.p[type].push({item: '', amount: null, description: ''})
        } else {
            this.p[type].push({item: '', amount: null, count: null, description: ''})
        }
        setTimeout(() => {
            this.initCells()
        }, 55)
    }

    deleteMoneyLine(type, idx) {
        this.p[type].splice(idx, 1);
        if (type == 'current_yield')this.countSumTable('current_yield', 'founding_sum');
        else {
            this.countSumTable(type, type + '_total');
        }
    }

    addVideo(video) {
        this.p.video = video
    }

    callbackReward(rewards) {
        this.r = rewards
    }

    legalsChanges(ind, type, obj) {
        if (type == 'delete') {
            this.l.splice(ind, 1)
        } else if (type == 'edit') {
            this.l[ind] = obj;
        } else if (type == 'create') {
            obj.name = obj.data.ii_name || obj.data.ur_name;
            this.l.push(obj)
        }
    }

    init() {
        //angular.element.scrollTo(2000, 100);
        //angular.element('#modalRewardNew').modal('show');
        this.initCells();
        //this.initDocs()

    }

    initCells() {
        var jQ = angular.element;
        // обработчики ячеек таблиц/ пересчитываю при каждом добавлении поля
        jQ('.textarea--edit i').click(function () {
            var p = jQ(this).parent();
            var t = p.find('textarea').val();
            p.addClass('correction');
            p.find('textarea').val('').val(t).focus();

        });
        jQ('.text--edit i').click(function () {
            var p = jQ(this).parent();
            var i = p.find('input').val();
            p.addClass('correction');
            p.find('input').val('').val(i).focus();

        });
        jQ('.textarea--edit textarea').focusout(function () {
            jQ(this).parent().removeClass('correction')
        });
        jQ('.text--edit input').focusout(function () {
            jQ(this).parent().removeClass('correction');
        });

    }


// ленивая загрузка пдф по клику на колапс. работает по id pdfLend1 pdfLend2
    // работает единижды для каждого коллапса
    /*initDocs(id) {
     if(this.temp[id]) return;
     this.temp[id] = 1;
     angular.element(id).gdocsViewer();
     }*/

}