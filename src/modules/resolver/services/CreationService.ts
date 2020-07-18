import { account, ChainId, IRequest, SetAccountPropertyParams, UploadTaggedDataParams } from "@blobaa/ardor-ts";
import { DATA_CLOUD_NAME, DID_ID_LENGTH } from "../../../constants";
import { CreateDIDParams, CreateDIDResponse, DIDNetworkType, State } from "../../../types";
import { ICreationService } from "../../internal-types";
import DataFields from "./utils/DataField";
import DIDFields from "./utils/DIDFields";
import Nonce from "./utils/Nonce";


export default class CreationService implements ICreationService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse> {
        const cloudParams: UploadTaggedDataParams = {
            chain: ChainId.IGNIS,
            name: DATA_CLOUD_NAME,
            data: JSON.stringify(params.payload),
            secretPhrase: params.passphrase
        };

        const cloudResponse = await this.request.uploadTaggedData(url, cloudParams);


        const payloadReferenceObject = { fullHash: cloudResponse.fullHash };
        const dataFields = new DataFields();
        dataFields.payloadReference = JSON.stringify(payloadReferenceObject);
        dataFields.didId = Nonce.generate(DID_ID_LENGTH);
        dataFields.state = State.ACTIVE;

        const propertyParams: SetAccountPropertyParams = {
            chain: ChainId.IGNIS,
            property: dataFields.didId,
            value: dataFields.createDataFieldsString(),
            recipient: account.convertPassphraseToAccountRs(params.passphrase),
            secretPhrase: params.passphrase
        };

        const propertyResponse = await this.request.setAccountProperty(url, propertyParams);


        const didFields = new DIDFields();
        didFields.networkType = params.isTestnetDid ? DIDNetworkType.TESTNET : DIDNetworkType.MAINNET;
        didFields.fullHash = propertyResponse.fullHash;
        const did = didFields.createDidString();
        
        return { did };
    }
}