import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import * as dotenv from 'dotenv';

dotenv.config();

export const elasticsearchConfig: ElasticsearchModuleOptions = {
  node: process.env.ELASTICSEARCH_HOST,
  auth: {
    username: process.env.ELASTICSEARCH_USER,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
