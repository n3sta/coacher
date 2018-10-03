import trainingType from '../../models/TrainingType';

export default async function fillTrainingTypes(_id, res) {
	    await new TrainingType([
	        {
	            name: 'Rozbieganie',
	            userId: _id
	        },
	        {
	            name: 'Siła biegowa',
	            userId: _id
	        },
	        {
	            name: 'II zakres',
	            userId: _id
	        },
	        {
	            name: 'Interwał',
	            userId: _id
	        },
	        {
	            name: 'Zawody',
	            userId: _id
	        }
	    ]).save()
	        .then((res) => {
	            return res.status(200).json({
	                entity: res,
	            });
	        })
	        .catch((err) => {
	            return res.status(400).json({
	                error: err
	            });
	        });
	}