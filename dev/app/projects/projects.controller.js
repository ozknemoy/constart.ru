export class ProjectsController {
    constructor($stateParams, $auth, $timeout, httpFactory, dictFactory, userFactory, metadataService,scrollTo,TYPE) {
        'ngInject';

        this.isAuthenticated = $auth.isAuthenticated();
        this.httpFactory = httpFactory;
        this.scrollTo = scrollTo;
        this.baseImgUrl = httpFactory.baseImgUrl;
        this.tab = 'CF';
        metadataService._setMetaTags('projects');
//filter init
        var catId = $stateParams.category ? +$stateParams.category : undefined;
        // uib-collapse
        this.collapse = {
            full_filter: false,
            inv: false,
            loan: false
        };
        // для перелогина
        userFactory.checkDataRelogin();

        this.isCF = TYPE=='air';
        this.getCleanFilter();
        this.handleCategory();

        if (TYPE === 'air') {
            this.getWithFilter({
                "project_category": 146,
                "project_category_sub": catId,
                crowdfunding: 1
            },false);
        } else {
            this.getWithFilter({
                "project_category": catId,
                crowdfunding: 1
            },false);
        }

        httpFactory
            .getProjCategory()
            .then(d=> {
                if(TYPE === 'air') {
                    this.f.project_category = d.data[0];
                    this.f.project_category_sub = _.where(d.data[0].items, 'id', catId);
                    $timeout(()=>this.project_category = d.data);
                } else {
                    this.project_category = d.data;
                    this.f.project_category = _.where(this.project_category, 'id', catId);

                }

            });

        httpFactory
            .getGeo()
            .then(d=> {
                this.geo = dictFactory.transitObj(d.data, 'regions');
            });

        this.fData = {
            stages: dictFactory.stages,
            user_status: dictFactory.getObj('user_statuses'),
            incubators: dictFactory.incubators
        };

        this.setTab = (name)=> {
            this.getCleanFilter();
            this.tab = name;
            /*this.f.crowdinvesting = name==='CI'? 1:0;
            //this.f.crowdlending = name==='CI'? 1:0;
            this.f.crowdfunding = name==='CF'? 1:0;
            this.f.type_id = name==='PR'? 3:null;*/
            switch(name) {
                case 'CF':
                    this.f.type_id = 1;
                    break;
                case 'CI':
                    this.f.type_id = 2;
                    break;
                case 'PR':
                    this.f.type_id = 3;
                    break;
            }
            this.filterHandler();
        };

        this.changeCountry = ()=> {
            this.regionsOfContry = _.where(this.geo,'id',this.f.country_id).regions;
            this.f.region_id=null
        };

        //обработка запроса отфильтрованых проектов todo factory
        this.filterHandler = ()=> {
            var fEnd = angular.copy(this.f);
            // сначала чищу значения по умолчанию
            if (fEnd.founding_sum_max == 1000000000) delete fEnd.founding_sum_max;
            if (fEnd.founding_sum_min == 10000) delete fEnd.founding_sum_min;
            if (fEnd.inv_rate_max == 1000) delete fEnd.inv_rate_max;
            if (fEnd.inv_rate_min == 1) delete fEnd.inv_rate_min;
            if (fEnd.loan_rate_max == 100) delete fEnd.loan_rate_max;
            if (fEnd.loan_rate_min == 1) delete fEnd.loan_rate_min;
            if (!fEnd.crowdlending) {
                delete fEnd.crowdlending;
                delete fEnd.loan_term_max;
                delete fEnd.loan_term_min;
                delete fEnd.payback_period_max;
                delete fEnd.payback_period_min;
            } else {
                if(fEnd.loan_term_max==240) delete fEnd.loan_term_max;
                if(fEnd.loan_term_min==1) delete fEnd.loan_term_min;
                if(fEnd.payback_period_max==240) delete fEnd.payback_period_max;
                if(fEnd.payback_period_min==1) delete fEnd.payback_period_min;
            }

            // обработка
            if (fEnd.project_category) {
                //fEnd.project_category = fEnd.project_category.id;
                /*if(TYPE === 'air') {
                    if(fEnd.project_category_sub) {
                        //fEnd.project_category_sub = fEnd.project_category_sub.id
                    }

                } else {

                }*/
                if(fEnd.project_category_sub_sub) {
                    fEnd.project_category_sub = fEnd.project_category_sub_sub
                }
                fEnd.project_category = fEnd.project_category_sub ? fEnd.project_category_sub : fEnd.project_category.id;

            } else {
                delete fEnd.project_category;
            }
            fEnd.stages = dictFactory.ObjToArr(this.f.stages);
            if (!fEnd.stages) delete fEnd.stages;
            if (!fEnd.region_id) delete fEnd.region_id;
            this.getWithFilter(fEnd);

        };

    }

    handleCategory() {
        this.f.project_category_sub=null;
        this.f.project_category_sub_sub=null;
        this.catThirdWithoutItems = true;// просто для disabled
    }

    handleSubCategory() {
        this.f.project_category_sub_sub=null;

        if(this.f.project_category_sub) {
            this.categoriesThirdLevel = _.where(this.f.project_category.items,'id',this.f.project_category_sub).items;
        } else {
            this.categoriesThirdLevel = null;
        }
        this.catThirdWithoutItems = !this.categoriesThirdLevel;

    }

    getCleanFilter() {
        this.f = {
            founding_sum_min: 10000,
            founding_sum_max: 1000000000,
            inv_rate_min: 1,
            inv_rate_max: 1000,
            payback_period_min: 1,
            payback_period_max: 240,
            loan_term_min: 1,
            loan_term_max: 240,
            loan_rate_min: 1,
            loan_rate_max: 100
        };
        //this.f.crowdfunding= this.isCF? 1:undefined;
    }

    getWithFilter(obj = {},withScroll=true) {
        this.pendSearch = 1;
        this.httpFactory
            .post('project/list', obj)
            .then((d)=> {
                this.projects = d.data;
                if(this.projects.length && withScroll) this.scrollTo('#anchor');
                this.pendSearch = 0;
            });
    }

    getWithoutFilter() {
        this.httpFactory.get('project/list').then((d)=> {
            this.projects = d.data;
        });
    }

}