import * as dotenv from 'dotenv';
dotenv.config();

import { app } from './bot';

// Listen for incoming requests.
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️ LNPingBot Server is running at https://localhost:${port}`);
});
