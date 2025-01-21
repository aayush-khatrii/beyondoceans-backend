import { SESClient } from '@aws-sdk/client-ses';
import { awsSESCredProvider } from '../providers/awsProvider';

const awsSESclient = new SESClient(awsSESCredProvider);

export default awsSESclient;