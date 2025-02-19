import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import * as dotenv from 'dotenv';

dotenv.config();

export const elasticsearchConfig: ElasticsearchModuleOptions = {
  node: process.env.ELASTICSEARCH_NODE || 'https://5.75.227.63:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'rQQtbktwzFqAJS1h8YjP',
  },
  tls: {
    rejectUnauthorized: false,
  },
};
