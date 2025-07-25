var express = require('express');
var router = express.Router();

require('../models/connection');
const Place = require('../models/places');
const { checkBody } = require('../../../../week6/morningnews-part5/backend/modules/checkBody');

router.post('/', (req, res) => {
    if(!checkBody(req.body, ['name'])) {
        res.json({ result: false, error: 'Missing or empty fields'});
        return;
    }

    Place.findOne({name: req.body.name}).then(data => {
        if (data === null) {
            const newPlace = new Place({
                nickname: req.body.nickname,
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            });

            newPlace.save().then(newMark => {
                res.json({ result: true, data: newMark});
            });
        } else {
            res.json({ result: false, error: 'Marker already exists'});
        }
    });
});

router.get('/:nickname', (req, res) => {
    Place.find({ nickname: req.params.nickname }).then(data => {
        if(data) {
            res.json({ result: true, places: data })
        } else {
            res.json({ result: false, error : 'Markers not found' });
        }
    })
})

router.delete('/', (req, res) => {
    if(!checkBody(req.body, ['nickname', 'name'])) {
        res.json({ result: false, error: 'Missing or empty fields'});
        return;
    }

    Place.deleteOne({ nickname: req.body.nickname, name: req.body.name }).then(deleteData => {
        if(deleteData) {
            res.json({ result: true })
        } else {
            res.json({ result: false, error: "Marker not found !" })
        }
    })
});



module.exports = router;