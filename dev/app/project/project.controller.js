
export class ProjectController {
    constructor($rootScope, $auth, $sce, $localStorage, $timeout, $stateParams, $state,$location,$filter,
                httpFactory, countFactory, dictFactory, metadataService,
                handleDataFactory, userFactory,userAgentF,TYPE) {
        'ngInject';

        this.$filter = $filter;
        this.userAgentF = userAgentF;
        this.$timeout = $timeout;
        this.handleDataFactory = handleDataFactory;
        this.httpFactory = httpFactory;
        this.isAuthenticated = $auth.isAuthenticated();
        this.state = $state.current.url.slice(1);
        this.baseImgUrl = httpFactory.baseImgUrl;
        this.baseDocUrl = httpFactory.baseDocUrl;
        this.countFactory = countFactory;
        this.URL = $location.$$absUrl;
        console.log("$state",$location.$$absUrl,$state);

        this.isOdvf = TYPE === 'air';
        this.isCS = TYPE === 'all';
        this.id = parseInt($stateParams.id) ? parseInt($stateParams.id) : 0;
        if (!this.id || isNaN(this.id)) {
            $state.go('home');
            return
        }
        // для перелогина
        userFactory.checkDataRelogin();
        this.userId = $localStorage.user_id || 0;
        this.temp = {};
        this.total = {};
        this.team = {};
        this.pend = {};
        this.countin = {invest: 1, loan: 1000, reward: 1};

        //проверка num в адресе. отвечает за активный таб во вкладке fin/ не больше 4
        // продолжение логики будет после получения значений  investments_found_sum и тд
        this.num = Math.min(4, (this.num = !isNaN(parseInt($stateParams.num)) && $stateParams.num !== '' ?
            parseInt($stateParams.num) : 0));

        // отправляю id проверки состояния логина
        httpFactory.get('project/' + this.id + '/view?userId=' + this.userId).then(
            d=> {
                this.proj = d.data;
                metadataService.setMetaTags(`${this.proj.name} - проект для привлечения инвестиций на платформе CONSTART.RU`,
                    this.proj.short_descr,this.proj.cover);
                this.proj.isCurrentUserProject = this.userId == this.proj.owner_id ? 1 : 0;
                //this.proj.like = true;
                // проверка на НЕ публикацию
                if (this.proj.status < 4 && !this.proj.isCurrentUserProject) {
                    $state.go('home');
                    return
                }
                // определение типа проекта/ кф
                if(this.proj.reward_found_sum && !this.proj.investments_found_sum &&!this.proj.loan_found_sum) {
                    this.isCF = 1
                }

                // проверяю устарел ли логин  но только на своем проекте
                if(this.proj.relogin==1 && this.proj.isCurrentUserProject ) {
                    console.error("relogin==1 + isCurrentUserProject");
                    userFactory._reLogin();
                    return
                }
                this.owner = {
                    foto: this.proj.owner.foto,
                    id: this.proj.owner.id,
                    name: this.proj.owner.name,
                    surname: this.proj.owner.surname,
                    fullName: this.proj.owner.name + ' ' + this.proj.owner.surname
                };

                //this.proj.posted_date = handleDataFactory.//dateRUfromISO(this.proj.posted_date);
                this.bgi = {'background-image': 'url(' + this.baseImgUrl + this.proj.foto + ')'};
                //проверка свой проект или нет

                this.proj.video = handleDataFactory.getYoutubeVideoObj(this.proj.video);

                httpFactory.get(`project-news/get-short-list?project_id=${this.id}`).then(d=> {
                    this.news = d.data
                });

                this.httpFactory.getGeo().then(d=> {
                    this.geo = d.data;
                    this.CountryAndRegion = this.getCountryAndRegion(this.proj.country_id,this.proj.region_id);
                    this.CountryAndRegion = this.CountryAndRegion ? this.CountryAndRegion.split(',') : 0;
                });

                this.httpFactory.get('reward/index?project_id='+this.id).then(d=>{
                    this.r = d.data;
                    //продолжение логики табов
                    // 0 кф , 1 кл, 2 ки, но порядок табов во вью другой
                    // первый параметр это номер таба из урла
                    this.num = this.getActiveTab(this.num, this.proj.reward_found_sum, this.proj.investments_found_sum,
                        this.proj.loan_found_sum, this.proj.isCurrentUserProject && this.r.length, this.proj.isCurrentUserProject);
                    this.numBudget = this.getActiveTab(0, this.total.current_yield, this.total.estimate_monthly,
                        this.total.estimate_capital, this.r.length,false);
                    
                });

                this.dataGeted = 1;
                this.isEnded = this.proj.status>5 ? 1 : 0;
                this.details();
                this.init();
                this.initData($sce, dictFactory, httpFactory);
                this.moneyTotal();

            }, e=> {
                // редирект если логин устарел на этой машине
                userFactory.reLogin(e);
                if(e.data.message = "В данный момент этот проект закрыт от публичного просмотра") {
                    $state.go('home')
                }
            });

        this.teamF = {status:{0:true,1:true,3:true,4:true}};


        // при смене страницы перерисовываю анимацию хедера
        $rootScope.$on('$stateChangeStart',
            (event, toState, toParams, fromState, fromParams, options)=> {
                // закрываю мобильное меню
                this.temp.prj_mOpen = 0;
            });

        this.getCountryAndRegion = function (cID,regID) {
            return handleDataFactory.getCountryAndRegion(cID,regID,this.geo);
        };
    }

    openSocial(type) {
        var url,target,img = this.proj.foto ? this.baseImgUrl+this.proj.foto : location.host + '/assets/img/default_img.png';
        switch(type) {
            case 'FB':
                url = `https://www.facebook.com/sharer.php?u=${this.URL}&title=${this.proj.name}&description=${this.proj.short_descr}&picture=${img}`;/*&summary=SUMMARY*/
                target = 'FaceBookWindow';
                break;
            case 'VK':
                url = `https://vk.com/share.php?url=${this.URL}&title=${this.proj.name}&image=${img}`;
                target = 'VkWindow';
                break;
            case 'OK':
                url = `https://connect.ok.ru/offer?url=${this.URL}&title=${this.proj.name}&description=${this.proj.short_descr}&imageUrl=${img}`;
                target = 'OkWindow';
                break;
        }
        
        window.open(url,target, 'toolbar=0, status=0, width=650, height=450')
    }

    getActiveTab(num, tab0, tab1, tab2, tab3, tab4) {
        if ((num == 0 && tab0) || (num == 1 && tab1) || (num == 2 && tab2) || (num == 3 && tab3) || (num == 4 && tab4)) {
            return num;
        }

        // если таб закрыт то проверяю следущий и так все
        if (num == 0 && !tab0) num++;
        if (num == 1 && !tab1) num++;
        if (num == 2 && !tab2) num++;
        if (num == 3 && !tab3) num++;
        if (num == 4 && !tab4) num++;
        return num;
    }
    
    count(model, sign) {
        if (sign == 'minus') {
            this.countin[model]--
        } else {
            this.countin[model]++
        }
    }

    details() {
        this.details = {};

        this.details.full_own_money =
            this.countFactory.notN(this.proj.own_money,this.proj.credit_sum);
        this.details.collected_sum = this.countFactory.notN(
            this.details.full_own_money,
            this.proj.reward_collected_sum,
            this.proj.investments_collected_sum,
            this.proj.loan_collected_sum
        );
        this.details.found_sum = this.countFactory.notN(
            this.proj.reward_found_sum,
            this.proj.investments_found_sum,
            this.proj.loan_found_sum
        );
        this.details.sum_percent = this.$filter('myround')(100 * this.details.collected_sum / this.proj.founding_sum,1,true);
        this.details.sum_percent_100 = Math.min(100,this.details.sum_percent);
        this.details.own_money_percent = this.$filter('myround')(100 * this.details.full_own_money / this.proj.founding_sum,1,true);
        this.details.reward_percent = this.$filter('myround')(100 * this.proj.reward_collected_sum / this.proj.reward_found_sum,1,true);
        this.details.reward_percent_100 = Math.min(100,this.details.reward_percent);
        this.details.investments_percent = this.$filter('myround')(100 * this.proj.investments_collected_sum / this.proj.investments_found_sum,1,true);
        this.details.investments_percent_100 = Math.min(100,this.details.investments_percent);
        this.details.loan_percent = this.$filter('myround')(100 * this.proj.loan_collected_sum / this.proj.loan_found_sum,1,true);
        this.details.loan_percent_100 = Math.min(100,this.details.loan_percent);

        this.details.restForLoan = this.proj.loan_found_sum-(this.proj.loan_collected_sum||0);
    }

    moneyTotal() {
        //подсчет итого таблиц смет
        var types = ['current_yield', 'estimate_monthly', 'estimate_capital'];
        for (var j in types) {
            this.total[types[j]] = 0;
            var amount = 0;
            for (var i in this.proj[types[j]]) {
                if (types[j] !== 'estimate_capital') {
                    var v = parseFloat(this.proj[types[j]][i]['amount']);
                    amount += isNaN(v) ? 0 : v;

                } else {
                    var v = parseFloat(this.proj[types[j]][i]['amount']);
                    var c = parseFloat(this.proj[types[j]][i]['count']);
                    amount += this.countFactory.notN(v) * this.countFactory.notN(c);
                }
            }
            this.total[types[j]] = isNaN(amount) ? 0 : amount;
        }

        this.temp.investments_min_share = this.$filter('myround')(this.proj.investments_min_share,5,'math');

        // логика табов Budget
        //this.numBudget = this.getActiveTab(0, this.total.current_yield, this.total.estimate_monthly, this.total.estimate_capital, false,false);

        //Прибыль в месяц
        this.temp.profit_per_month = this.total.estimate_capital - this.total.estimate_monthly;
        this.temp.profit_per_month = isNaN(this.temp.profit_per_month) ? 0 : this.temp.profit_per_month;

        //Срок окупаемости
        var intermed = parseFloat(this.proj.founding_sum / (this.total.estimate_capital - this.total.estimate_monthly));
        this.temp.timeCoverExpend = (isNaN(intermed) || intermed == 'Infinity')? 0 :
                    this.$filter('myround')(intermed + parseInt(this.proj.found_payback_period), 0, 1);
        //this.total.payback_period = this.temp.profit_per_month
        //    ? this.proj.found_payback_period + this.proj.investments_found_sum / (this.temp.profit_per_month * this.proj.investments_share / 100) : 0;


        // countInvest
        if(!this.proj.investments_share_count||!this.proj.investments_found_sum||!this.proj.investments_share) return;

        // размер мин доли в %
        //this.temp.ci_min_sell_part_amount = this.proj.investments_share/this.proj.investments_share_count;

        // стоимость мин доли
        this.temp.ci_min_sell_part_amount_cost =
            this.proj.investments_found_sum*this.proj.investments_min_share/this.proj.investments_share;
        // требуется собрать * размер мин доли в % / количество долей

        //Размер дивидендов на 1 минимальную долю в месяц    profit_per_month считается в вьюшке
        var p1 = this.temp.profit_per_month * (this.proj.investments_min_share/100);
        this.temp.ci_dividend_for_min_sell_part_per_month = isNaN(p1) ? 0 : p1;

        //Дивиденды в год на одну долю:
        this.temp.dividendsOnOneSharePerYear = this.$filter('myround')(12*this.temp.ci_dividend_for_min_sell_part_per_month||0);

        //Общая выплата по дивидендам в мес
        this.temp.ci_total_dividend_amount_per_month = 100*this.temp.profit_per_month*this.proj.investments_share;

        //Годовая доходность инвестиций
        this.temp.ci_invest_profit_per_year =
            100*this.temp.ci_dividend_for_min_sell_part_per_month*12/this.temp.ci_min_sell_part_amount_cost;

    }

    initData($sce, dictFactory, httpFactory) {
        this.temp.prjCollapse = false;
        this.proj.descr_1 = $sce.trustAsHtml(this.proj.descr_1);

        this.residents = dictFactory.incubators;
        var f = this.proj.foto? this.baseImgUrl + this.proj.foto : "assets/img/ptrn.png";
        this.temp.f = {'background-image':'url('+ f +')'};


        this.stages = dictFactory.stages;

        httpFactory.getProjCategory().then(d=> {
            for (var i = 0; i < d.data.length; i++) {
                if (d.data[i].id == this.proj.category_id) {
                    this.proj.category = d.data[i].name;
                    // из-за того что есть категории без подкатегорий:
                    if(d.data[i].items) {
                        for (var j = 0; j < d.data[i].items.length; j++) {
                            if (d.data[i].items[j].id == this.proj.category_sub_id) {
                                this.proj.category_sub = d.data[i].items[j].name;
                                break
                            }
                        }
                    }
                    break
                }
            }
            this.cat = d.data;
        });

        // если проект собирает лендингом
        if(this.proj.loan_payment_order && this.proj.loan_main_debt) {
            this.temp.loan_payment_order = _.where(dictFactory.payment_order,'id',this.proj.loan_payment_order).name;
            this.temp.loan_main_debt = _.where(dictFactory.payment_order_body,'id',this.proj.loan_main_debt).name;
        }
        // осталось до завершения
        // по старому this.temp.remain = this.$filter('diffDate')(this.proj.posted_date,this.proj.found_period,true);
        this.temp.remain = this.$filter('diffDates')('now',this.proj.found_finish_date,true,true);

        // существительное для remain
        // когда разница дат >0 и <1 то показываю часы и вернется тип string
        this.temp._remain = typeof this.temp.remain === 'number'?
            this.$filter('getNoun')(this.temp.remain,'день','дня','дней'):
            this.$filter('getNoun')(this.temp.remain,'час','часа','часов');

    }

    checkLoanSum() {
        var isOk = this.countin.loan % 10 == 0;
        this.countin.loan = isOk ? this.countin.loan : this.$filter('myround')(this.countin.loan / 10, 0, 'math') * 10
    }

    init() {
        setTimeout(() => {

        var jQ = angular.element;


        // header scroll
        if (!this.userAgentF.isMobile.any()) {
            var prh =  parseInt(jQ('.project_header').height());
            jQ('.project_header').height(prh);
            jQ('.project').css({
                'padding-top': prh + 70 + 'px'
            });
            jQ(window).scroll(function () {
                var winscr = jQ(window).scrollTop(),
                    prh_scr = jQ('.project_header').height(),
                    prh_title = jQ('.project_header--title').height();

                if (jQ(window).scrollTop() > 1)
                    jQ('body').addClass('scr');
                else
                    jQ('body').removeClass('scr');

                if (winscr >= 30 && winscr < (prh - prh_title)) {
                    jQ('.project_header--wrap').fadeOut(300);
                    jQ('.project_header').height(prh - winscr);
                }
                else if (winscr > (prh - prh_title)) {
                    jQ('.project_header').height(prh_title + 20);
                }
                else if (winscr < 30) {
                    jQ('.project_header').height(prh);
                    jQ('.project_header--wrap').fadeIn(300);
                }
            });

        } else {
            if (jQ(window).scrollTop() > 1)
                jQ('body').addClass('scr');
            else
                jQ('body').removeClass('scr');

            jQ('.project_header').addClass('mob_header');

            jQ(window).scroll(function () {
                var winscr = jQ(window).scrollTop(),
                    prh_scr = jQ('.project_header').height();
                if (winscr > prh_scr) {
                    jQ('.project_header--links').addClass('prh_l--show');
                } else {
                    jQ('.project_header--links').removeClass('prh_l--show');
                }
            });
        }
        }, 500);
    }
}