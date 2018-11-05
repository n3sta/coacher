import Invitation from '../models/Invitation';

export default {
    async find(req, res) {
        const invitations = await Invitation.find({coach: req.query.coach});

        return res.status(200).json(invitations);
    },
    async create(req, res) {
        const invitation = await Invitation.findOne({email: req.body.email});
        if (!invitation) {
            await new Invitation(req.body).save();
        }

        return res.status(200).json(email);
    },
    async delete(req, res) {
        const invitation = await Invitation.find({_id: req.params.id}).remove();

        return res.status(200).json(invitation);
    },
}