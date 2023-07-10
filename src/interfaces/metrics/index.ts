import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MetricsInterface {
  id?: string;
  follower_count?: number;
  engagement_rate?: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface MetricsGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
