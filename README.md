# did-resolver-ts

A DID resolver for the baa DID method.

This library implements the blobaa (baa) DID method specification.


## Table of Contents

- [did-resolver-ts](#did-resolver-ts)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Install](#install)
  - [Usage](#usage)
    - [Create and register DID and DID Document](#create-and-register-did-and-did-document)
    - [Resolve DID](#resolve-did)
    - [Update DID Document](#update-did-document)
    - [Update DID Controller Account](#update-did-controller-account)
    - [deactivate DID](#deactivate-did)
    - [Error Handling](#error-handling)
  - [API](#api)
  - [Contributing](#contributing)
  - [License](#license)


## Background

TBD


## Install

```
npm install @blobaa/did-resolver-ts
```


## Usage

### Create and register DID and DID Document

````typescript
import { DIDDocKey, DIDDocRelationship, DIDDocRelationshipType, DIDDocument } from "@blobaa/did-document-ts";
import { CreateDIDParams, resolver } from "@blobaa/did-resolver-ts";


const createDID = async(): Promise<void> => {

    /* Even though not necessary, it is recommended to create a DID Document template with
      the @blobaa/did-document-ts package.
    */

    /* create or import DID Document public keys  */
    const key = new DIDDocKey();
    await key.generate();
    const publicKey = key.publish();

    const authentication = new DIDDocRelationship({
        relationshipType: DIDDocRelationshipType.AUTHENTICATION,
        publicKeys: [ publicKey ]
    });

    const document = new DIDDocument({
        relationships: [ authentication ]
    });

    const didDocTsTemplate = document.publish();


    /* You can also use an otherwise created template */
    const didDocTemplate = {
        "@context": [ "https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1" ],
        id: "", // already existing DIDs will be overwritten in the resolution process
        authentication: [
            {
                id: "#z6Mkq9uAju2ezpgoT8q88pqMDLcZ4wJQXZiNKpT4SyJ8xCDQ",
                type: "Ed25519VerificationKey2018",
                publicKeyBase58: "Bhe89enDfHCLLdzRTFsWNF4ZFN2Z7gU1doY8chL82yS2"
            }
        ]
    };


    /* set parameters */
    const params: CreateDIDParams = {
        didDocumentTemplate: didDocTemplate,
        passphrase: "<controller account passphrase>",
        isTestnetDid: true
    };

    try {

        /* create and register DID and DID Document */
        const resp = await resolver.createDID("https://testardor.jelurida.com", params);

        console.log("DID:", resp.did); // did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe
        console.log("DID Document:", JSON.stringify(resp.didDocument, undefined, 4));
        /*
        {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/v1"
            ],
            "id": "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe",
            "authentication": [
                {
                    "id": "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe#z6Mkq9uAju2ezpgoT8q88pqMDLcZ4wJQXZiNKpT4SyJ8xCDQ",
                    "type": "Ed25519VerificationKey2018",
                    "publicKeyBase58": "Bhe89enDfHCLLdzRTFsWNF4ZFN2Z7gU1doY8chL82yS2"
                }
            ]
        }
        */

    } catch (e) { /* see error handling */ }
};

createDID();
````


### Resolve DID

````typescript
import { ResolveDIDParams, resolver } from "@blobaa/did-resolver-ts";


const resolveDID = async(): Promise<void> => {

    /* set parameters */
    const params: ResolveDIDParams = {
        did:"did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe"
    };

    try {

        /* resolve DID */
        const response = await resolver.resolveDID("https://testardor.jelurida.com", params);

        console.log("DID:", response.did); // did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe
        console.log("DID Document", JSON.stringify(response.didDocument, undefined, 4));
        /*
        {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/v1"
            ],
            "id": "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe",
            "authentication": [
                {
                    "id": "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe#z6Mkq9uAju2ezpgoT8q88pqMDLcZ4wJQXZiNKpT4SyJ8xCDQ",
                    "type": "Ed25519VerificationKey2018",
                    "publicKeyBase58": "Bhe89enDfHCLLdzRTFsWNF4ZFN2Z7gU1doY8chL82yS2"
                }
            ]
        }
        */

    } catch (e) { /* see error handling */ }
};

resolveDID();
````


### Update DID Document

````typescript
import { DIDDocKey, DIDDocRelationship, DIDDocRelationshipType, DIDDocument } from "@blobaa/did-document-ts";
import { resolver, UpdateDIDDocumentParams } from "@blobaa/did-resolver-ts";


const updateDIDDocument = async(): Promise<void> => {

    /* create new DID Document template */
    const key = new DIDDocKey();
    await key.generate();
    const publicKey = key.publish();

    const authentication = new DIDDocRelationship({
        relationshipType: DIDDocRelationshipType.AUTHENTICATION,
        publicKeysAsRef: [ publicKey ]
    });

    const assertion = new DIDDocRelationship({
        relationshipType: DIDDocRelationshipType.ASSERTION_METHOD,
        publicKeysAsRef: [ publicKey ]
    });

    const document = new DIDDocument({
        relationships: [ authentication, assertion ],
        publicKeys: [ publicKey ]
    });

    const didDocTsTemplate = document.publish();


    /* set parameters */
    const params: UpdateDIDDocumentParams = {
        did:"did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe",
        newDidDocumentTemplate: didDocTsTemplate,
        passphrase: "<controller account passphrase"
    };

    try {

        /* update DID Document */
        const resp = await resolver.updateDIDDocument("https://testardor.jelurida.com", params);

        console.log("DID:", resp.did); // did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe
        console.log("new DID Document", JSON.stringify(resp.newDidDocument, undefined, 4));
        /*
        {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/v1"
            ],
            "id": "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe",
            "publicKey": [
                {
                    "id": "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe#z6MkqSkgHX9yBBSsmpABk2wgyjE2SpDJTYtWKfo2HSgY4Ymm",
                    "type": "Ed25519VerificationKey2018",
                    "publicKeyBase58": "BzVdhGuXqdxQfKKV4Tyr8dg2dEwT3fe9det6TAiX9KzP"
                }
            ],
            "authentication": [
                "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe#z6MkqSkgHX9yBBSsmpABk2wgyjE2SpDJTYtWKfo2HSgY4Ymm"
            ],
            "assertionMethod": [
                "did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe#z6MkqSkgHX9yBBSsmpABk2wgyjE2SpDJTYtWKfo2HSgY4Ymm"
            ]
        }
        */

    } catch (e) { /* see error handling */ }
};

updateDIDDocument();
````

### Update DID Controller Account

````typescript
import { resolver, UpdateDIDControllerParams } from "@blobaa/did-resolver-ts";


const updateDIDController = async(): Promise<void> => {

    /* set parameters */
    const params: UpdateDIDControllerParams = {
        did:"did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe",
        passphrase: "<old controller account passphrase>",
        newPassphrase: "<new controller account passphrase>"
    };

    try {

        /* update DID Controller Account */
        const resp = await resolver.updateDIDController("https://testardor.jelurida.com", params);

        console.log("DID:", resp.did); // did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe
        console.log("old Account:", resp.oldControllerAccount); // "ARDOR-S27P-EHWT-8D2L-937R7"
        console.log("new Account:", resp.newControllerAccount); // "ARDOR-YQ26-W5RK-6ATW-G9HRT"

    } catch (e) { /* see error handling */ }
};

updateDIDController();
````


### deactivate DID

````typescript
import { DeactivateDIDParams, resolver } from "@blobaa/did-resolver-ts";


const deactivateDID = async(): Promise<void> => {

    /* set parameters */
    const params: DeactivateDIDParams = {
        did:"did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe",
        passphrase: account.bob.secret,
    };

    try {

        /* deactivate DID */
        const resp = await resolver.deactivateDID("https://testardor.jelurida.com", params);

        console.log("deactivated DID:", resp.deactivatedDid); // did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe

    } catch (e) { /* see error handling */ }
};

deactivateDID();
````


### Error Handling

There is an unified error handling for all APIs. Every API throws an error in case of any failures or unmet conditions. Every error implements the 'Error' interface of this library. The interface consist of two data fields. The code field contains a value of the 'ErrorCode' enum to indicate the error reason. The description field contains a human readable description of the error reason.

````typescript
import { resolver, Error, ErrorCode, ResolveDIDParams } from "@blobaa/did-resolver-ts";


const errorHandlingExample = async(): Promise<void> => {

    const params: ResolveDIDParams = {
        did:"did:baa:t:0cfe0be67dc0d4e1162fa2e9ccec798d83f8fd5d78a8a36ccd71e194abc60efe"
    };

    try {

        /* resolve DID */
        await resolver.resolveDID("https://testardor.jelurida.com", params);

    } catch (e) {

        /* all errors implement the library's Error interface */
        const error = e as Error;

        /* every error has an error code that corresponds to the ErrorCode enum */
        if (error.code === ErrorCode.DID_DEACTIVATED) {
            //  handle connection error here
        }

        console.log(error.code);
        console.log(error.description);
    }
};

errorHandlingExample();
````


## API

TBD


## Contributing

PRs accepted.

If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.


## License

[MIT](./LICENSE) © Attila Aldemir

