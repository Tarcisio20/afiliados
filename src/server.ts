import express from "express";
import cors from 'cors';
import router from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { mercadoLivreJob } from '@/scrapers/mercadolivre/job'; 
import { startJobsRunner } from '@/scrapers/runner';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use(globalErrorHandler);

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    const intervalMinutes = Number(process.env.JOB_MINUTES ?? 10);
    startJobsRunner(
    [mercadoLivreJob], // ✅ ordem aqui = ordem de execução
    intervalMinutes
  );
});