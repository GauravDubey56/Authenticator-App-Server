type EnvVar = string | undefined;

type apiResponse = {
  data?: any;
  error?: Error;
  redirectUrl?: string;
  statusCode: number;
  message?: string;
};
