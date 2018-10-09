import Invitation from '../models/Invitation';
import Training from "../models/Training";

export default {
    async find(req, res) {
        const invitations = await Invitation.find({coach: req.query.coach, active: true});

        return res.status(200).json(invitations);
    },
    async create(req, res) {
        const invitation = await new Invitation(req.body).save();

        return res.status(200).json(invitation);
    },
    async delete(req, res) {
        const invitation = await Invitation.find({_id: req.params.id}).remove();

        return res.status(200).json(invitation);
    },
}