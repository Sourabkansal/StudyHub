import express from 'express' ;
import { getChartData } from '../Controller/Charts/chartsController.js';

const charts = express.Router()
charts.post('/Get&Send' , getChartData )

export default charts ;