import express from 'express';
import { AiSchedul } from '../Controller/AiSchedule/AiScheduleController.js';

const AiSchedull = express.Router()
AiSchedull.post('/AiDays' , AiSchedul )

export default AiSchedull