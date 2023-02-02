import { RekognitionClient, CreateCollectionCommand } from  "@aws-sdk/client-rekognition";

// Set the AWS Region.
const REGION = "us-east-1";
const rekogClient = new RekognitionClient({ region: REGION });

// Name the collecction
const collectionName = "ZFamily"

const createCollection = async (collectionName) => {
    try {
       console.log(`Creating collection: ${collectionName}`)
       const data = await rekogClient.send(new CreateCollectionCommand({CollectionId: collectionName}));
       console.log("Collection ARN:")
       console.log(data.CollectionARN)
       console.log("Status Code:")
       console.log(String(data.StatusCode))
       console.log("Success.",  data);
       return data;
    } catch (err) {
      console.log("Error", err.stack);
    }
};

createCollection(collectionName);

/*
// Resulting output:

Creating collection: ZFamily
Collection ARN:
undefined
Status Code:
200
Success. {
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'b7ababf3-6369-4223-9cf3-b8a5bbd41fe2',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  CollectionArn: 'aws:rekognition:us-east-1:861121369612:collection/ZFamily',
  FaceModelVersion: '6.0',
  StatusCode: 200
}

*/