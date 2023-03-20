
const Tour = require('../models/tour')
const { response } = require('express');
var validateDate = require("validate-date");
var isPositiveInteger = require('is-positive-integer');
var isPositiveNumber = require('is-positive-number');
function check(req, res) {
    if (req.body.start_date && !(validateDate(req.body.start_date, responseType = "boolean"))) {

        res.status(400).send("required date format");
        return false;
    }
    if (req.body.duration && !isPositiveInteger(parseFloat(req.body.duration))) {
        res.status(400).send("duration must be positive integer");
        return false;
    }
    if (req.body.price && !isPositiveNumber(parseFloat(req.body.price))) {
        res.status(400).send("price must be positive integer");
        return false;

    }
    return true;
}

module.exports = {

    createTour: function (tourDetails, res) {
        tripId = tourDetails.body._id

        Tour.findById(tripId).then(tour => {
            if (tour) {
                return res.status(400).send("id already exit")
            }

        }).catch(e => res.status(400).send(e))





        if (!tourDetails.body._id || !tourDetails.body.start_date || !tourDetails.body.price || !tourDetails.body.duration) {
            res.status(400).send("all fiailed are required");
            return;
        }
        if (!check(tourDetails, res)) {
            return;
        }
        if (tourDetails.body.price < 0 || tourDetails.body.duration < 1) {
            res.status(400).send("wrong details");
            return;
        }
        const tour = new Tour(tourDetails.body)
        tour.save().then(tour => {
            res.status(201).send(tour)
        }).catch(e => {

            res.status(400).send(e)
        });

    },
    getTours: function (req, res) {


        Tour.find().then(tours => {
            res.send(tours)
        }
        ).catch(e => res.status(500).send())
    },

    AddCuponToTour: function (cuponDetails, res) {
        const tripId = cuponDetails.params["id"];
        if (!tripId) {
            res.status(400).send("id undefind");
            return;
        }
        if (!cuponDetails.body.code || !cuponDetails.body.percent || !cuponDetails.body.start_date || !cuponDetails.body.expire_date) {
            res.status(400).send("Part of the request is undefined");
            return;
        }
        if (cuponDetails.body.percent && !isPositiveNumber(parseFloat(cuponDetails.body.percent))) {
            res.status(400).send("percent must be positive integer");
            return;
        }
        if (cuponDetails.body.percent > 100) {
            res.status(400).send("percent must be small then 100");
            return;
        }

        if (cuponDetails.body.start_date && !(validateDate(cuponDetails.body.start_date, responseType = "boolean"))) {
            res.status(400).send("required date format");
            return;
        }
        if (cuponDetails.body.expire_date && !(validateDate(cuponDetails.body.expire_date, responseType = "boolean"))) {
            res.status(400).send("required date format");
            return;
        }

        Tour.findById(tripId).then(tour => {
            if (!tour) {
                return res.status(400).send("this id not exist")
            }

        }).catch(e => res.status(400).send(e))


        if (!tripId) {
            res.status(400).send("id undefind");
            return;
        }

        Tour.findById(tripId).then(tour => {
            if (!tour) {
                return res.status(404).send()
            }
            else {
                var i;
                var flag = 0;
                for (i = 0; i < tour.cupon.length; i++) {
                    if (tour.cupon[i].code == cuponDetails.body.code) {
                        flag = 1;

                        tour.cupon[i].percent = cuponDetails.body.percent;
                        tour.cupon[i].start_date = cuponDetails.body.start_date;
                        tour.cupon[i].expire_date = cuponDetails.body.expire_date;
                        break;
                    }

                }
                if (flag == 1) {//copon already exsist need update
                    Tour.findByIdAndUpdate(cuponDetails.params.id, tour, { new: true, runValidators: true }).then(tour => {
                        if (!tour) {
                            return res.status(404).send("no tour")
                        }
                        else {
                            res.send(tour)
                        }
                    }).catch(e => res.status(400).send(e))
                }
                if (flag == 0) {//code cupon not exist
                    tour.cupon.push(cuponDetails.body);
                    tour.save().then(tour => {
                        res.status(201).send(tour)
                    }).catch(e => {

                        res.status(400).send(e)
                    });
                }

            }
        }).catch(e => res.status(400).send(e))



    },

    AddSiteToTourpath: function (SiteDetails, res) {
        const tourId = SiteDetails.params["id"];

        if (!tourId) {
            res.status(400).send("id undefind");
            return;
        }
        const index = SiteDetails.params["index"];
        if (!index) {
            res.status(400).send("index undefind");
            return;
        }
        if (!SiteDetails.body.siteID) {
            res.status(400).send("siteID of the request is undefined");
            return;
        }

        if (index < 0) {
            res.status(400).send("index n must be positive integer");
        }
        Tour.findById(tourId).then(tour => {
            if (!tour) {
                return res.status(400).send("this id not exist")
            }

        }).catch(e => res.status(400).send(e))



        Tour.findById(tourId).then(tour => {
            if (!tour) {
                return res.status(404).send()
            }
            else {
                var len = tour.site.length;
                if (index > len){
                    tour.site.splice(len, 0, SiteDetails.body)
               console.log(SiteDetails.body)
                }

                else
                    tour.site.splice(index, 0, SiteDetails.body)

                tour.save().then(tour => {
                    res.status(201).send(tour)
                }).catch(e => {

                    res.status(400).send(e)
                });

            }
        })

    },






    getTour: function (tourDetails, res) {

        //router.get('/tours/:id', (req, res) => {
        const tripId = tourDetails.params["id"];
        if (!tripId) {
            res.status(400).send("id undefind");
            return;
        }
        Tour.findById(tripId).then(tour => {
            if (!tour) {
                return res.status(404).send()
            }
            else {
                res.send(tour)

            }
        }).catch(e => res.status(400).send(e))

    },


    deleteCopunFromTour: function (req, res) {
        const tripId = req.params["id"];
        if (!tripId) {
            res.status(400).send("required trip id");
            return;
        }

        const codeCopon = req.params["code"];
        if (!codeCopon) {
            res.status(400).send("required codeCopon");
            return;
        }
        Tour.findById(tripId).then(tour => {
            if (!tour) {
                return res.status(400).send("this id not exist")
            }
            for (i = 0; i < tour.cupon.length; i++) {
                if (!tour.cupon[i]) {
                    res.status(400).send("this cupon not exist");
                    return;
                }
            }

        }).catch(e => res.status(400).send(e))



        Tour.findById(tripId).then(tour => {
            for (i = 0; i < tour.cupon.length; i++) {
                if (tour.cupon[i].code == codeCopon) {
                    tour.cupon.splice(i, 1);
                }

            }
            tour.save().then(tour => {
                res.status(201).send(tour)
            }).catch(e => {

                res.status(400).send(e)
            });

        }).catch(e => res.status(400).send(e))

    },





    update_Trip: function (req, res) {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['_id', 'start_date', 'duration', 'price']
        const tripId = req.params["id"];

        if (!req.body._id || !req.body.start_date || !req.body.price || !req.body.duration) {
            res.status(400).send("all fiailed are required");
            return;
        }
        if (!check(req, res)) {
            return;
        }
        Tour.findById(tripId).then(tour => {
            if (!tour) {
                return res.status(400).send("this id not exist")
            }

        }).catch(e => res.status(400).send(e))
        Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).then(tour => {
            if (!tour) {
                return res.status(404).send("no tour")
            }
            else {
                res.send(tour)
            }
        }).catch(e => res.status(400).send(e))
    },

    deleteTour: function (req, res) {
        //router.delete('/tours/:id', (req, res) => {
        const tripId = req.params["id"];
        if (!tripId) {
            res.status(400).send("required trip id");
            return;
        }

        Tour.findById(tripId).then(tour => {
            if (!tour) {
                return res.status(400).send("this id not exist")
            }

        }).catch(e => res.status(400).send(e))
        Tour.findByIdAndDelete(tripId, function (err, docs) {
            if (err) {

            }
            else {

                res.send("deleted");
            }
        });


    }
}


