/**
 * Created by дима on 24.08.2016.
 */

export class ExpertController {
    constructor ($rootScope,$timeout) {
        'ngInject';

        this.slides = [
            {image:'http://placehold.it/300x200',id:1},
            {image:'http://placehold.it/400x200',id:2},
            {image:'http://placehold.it/500x200',id:3}
        ];

    }
}