import '../models/TrainingType';
import TrainingType from "../models/TrainingType";

const fillRegisterData = async (id) => {
    return await TrainingType.insertMany(
        [
            {
                user: id,
                name: 'Rozbieganie'
            },
            {
                user: id,
                name: 'Siła biegowa'
            },
            {
                user: id,
                name: 'II zakres'
            },
            {
                user: id,
                name: 'III zakres'
            },
            {
                user: id,
                name: 'Zawody'
            }
        ]
    );
};

export default fillRegisterData;