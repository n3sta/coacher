import express from 'express';
import mongoose from 'mongoose';
import TrainingType from '../models/TrainingType';

export default {
	async findAll(req, res, next) {
	    const trainingTypes = await TrainingType.find(req.filters);

	    return res.status(200).json(trainingTypes);
	},
	async create(req, res) {
	    const trainingType = await new TrainingType({
	    	user: req.body.user,
	    	name: req.body.name
	    }).save();

	    return res.status(200).json(trainingType);
	},
	async update(req, res) {
		const trainingType = await TrainingType.findOneAndUpdate({_id: req.params.id}, req.body);

		return res.status(200).json(trainingType);
	},
	async delete(req, res) {
		const trainingType = await TrainingType.find({_id: req.params.id}).remove();

		return res.status(200).json(trainingType);
	},
}