import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import  { RekognitionClient, IndexFacesCommand } from "@aws-sdk/client-rekognition";

const REGION = "us-east-1";
const BUCKET_NAME = "facialrecogdemo";
const COLLECTION_ID = "ZFamily";

const s3Client = new S3Client({ region: REGION });
const rekogClient = new RekognitionClient({ region: REGION });

const bucketParams = { Bucket: BUCKET_NAME };

const getPersonSlugFromKey = key => key.split('/')[1];

const getObjectKeys = async () => {
    const response =  await s3Client.send(new ListObjectsV2Command(bucketParams));
    return response.Contents.
        filter(content => content.Size > 0 && content.includes('people')).
        map(content => content.Key);
}

const indexAllImages = keys => {
    const indexFacesPromises = keys.map(key => {
        const indexFacesParams = {
            "CollectionId": COLLECTION_ID,
            "ExternalImageId": getPersonSlugFromKey(key),
            "Image": { 
                "S3Object": { 
                    "Bucket": BUCKET_NAME,
                    "Name": key
                }
            },
        };

        return rekogClient.send(new IndexFacesCommand(indexFacesParams));
    });

    return Promise.all(indexFacesPromises);
};

const run = async () => {
    const keys = await getObjectKeys();
    const results = await indexAllImages(keys);

    const faceRecords = results.flatMap(result => result.FaceRecords);
    console.log('RESULTS:', results)
    console.log('FACE RECORDS:', faceRecords);
}

run();

/*
Logged results:

RESULTS: [
  {
    '$metadata': {
      httpStatusCode: 200,
      requestId: 'c8de8a76-14f4-4972-bace-17abdcb18b6c',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    },
    FaceModelVersion: '6.0',
    FaceRecords: [ [Object] ],
    OrientationCorrection: undefined,
    UnindexedFaces: []
  },
  {
    '$metadata': {
      httpStatusCode: 200,
      requestId: '66957b2a-a058-4261-8c29-d69d03ffa952',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    },
    FaceModelVersion: '6.0',
    FaceRecords: [ [Object] ],
    OrientationCorrection: undefined,
    UnindexedFaces: [ [Object] ]
  },
  {
    '$metadata': {
      httpStatusCode: 200,
      requestId: '4c69426b-b374-456f-9669-b732b882505f',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    },
    FaceModelVersion: '6.0',
    FaceRecords: [ [Object] ],
    OrientationCorrection: undefined,
    UnindexedFaces: []
  }
]
FACE RECORDS: [
  {
    Face: {
      BoundingBox: [Object],
      Confidence: 99.99665832519531,
      ExternalImageId: 'haru',
      FaceId: '18b115fb-29cf-4777-a4e2-d04644be28af',
      ImageId: '41e53d84-7ad7-3806-8c0b-16f00d9af519',
      IndexFacesModelVersion: undefined
    },
    FaceDetail: {
      AgeRange: undefined,
      Beard: undefined,
      BoundingBox: [Object],
      Confidence: 99.99665832519531,
      Emotions: undefined,
      Eyeglasses: undefined,
      EyesOpen: undefined,
      Gender: undefined,
      Landmarks: [Array],
      MouthOpen: undefined,
      Mustache: undefined,
      Pose: [Object],
      Quality: [Object],
      Smile: undefined,
      Sunglasses: undefined
    }
  },
  {
    Face: {
      BoundingBox: [Object],
      Confidence: 99.99826049804688,
      ExternalImageId: 'kieran',
      FaceId: 'ad1654dd-5cc1-4169-8c57-4da226f3608f',
      ImageId: '20ed7c74-ca71-3055-a79a-d5be168e4440',
      IndexFacesModelVersion: undefined
    },
    FaceDetail: {
      AgeRange: undefined,
      Beard: undefined,
      BoundingBox: [Object],
      Confidence: 99.99826049804688,
      Emotions: undefined,
      Eyeglasses: undefined,
      EyesOpen: undefined,
      Gender: undefined,
      Landmarks: [Array],
      MouthOpen: undefined,
      Mustache: undefined,
      Pose: [Object],
      Quality: [Object],
      Smile: undefined,
      Sunglasses: undefined
    }
  },
  {
    Face: {
      BoundingBox: [Object],
      Confidence: 99.99961853027344,
      ExternalImageId: 'mz',
      FaceId: 'af69e858-f709-4bf9-8e7e-6974d7fc7569',
      ImageId: 'bb8c51b7-bf49-3ca8-a11b-e3e7cdb0bcc2',
      IndexFacesModelVersion: undefined
    },
    FaceDetail: {
      AgeRange: undefined,
      Beard: undefined,
      BoundingBox: [Object],
      Confidence: 99.99961853027344,
      Emotions: undefined,
      Eyeglasses: undefined,
      EyesOpen: undefined,
      Gender: undefined,
      Landmarks: [Array],
      MouthOpen: undefined,
      Mustache: undefined,
      Pose: [Object],
      Quality: [Object],
      Smile: undefined,
      Sunglasses: undefined
    }
  }
]

*/