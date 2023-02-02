import  { RekognitionClient, DeleteCollectionCommand } from "@aws-sdk/client-rekognition";

const REGION = "us-east-1";
const COLLECTION_ID = "ZFamily";

const rekogClient = new RekognitionClient({ region: REGION });

const run = async () => {
    const result = await rekogClient.send(new DeleteCollectionCommand({
        CollectionId: COLLECTION_ID,
    }));
    console.log(result);
};

run();