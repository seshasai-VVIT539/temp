import { IListItem } from "../Concerns/IListItem";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


export function createItem(
    data: IListItem,
    spHttpClient: SPHttpClient,
    siteUrl: string,
    listName: string
): Promise<SPHttpClientResponse> {
    let postBody = {
        "Name": data.title,
        "Family_x0020_Income": 100
    }
    const body: string = JSON.stringify(postBody);
    return spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
        SPHttpClient.configurations.v1,
        {
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'Content-type': 'application/json;odata=nometadata',
                'odata-version': ''
            },
            body: body
        })
        .then((response: SPHttpClientResponse): Promise<IListItem> => {
            return response.json();
        })
        .then((item: IListItem) => {
            return item.ID;
        })
        .catch((error) => {
            return error
        });
}

export function getAllItems(spHttpClient: SPHttpClient,
    siteUrl: string, listName: string): Promise<SPHttpClientResponse> {
    // return new Promise<SPHttpClientResponse>((): void => {
    return spHttpClient.get(
        `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
        SPHttpClient.configurations.v1,
        {
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'odata-version': ''
            }
        })
        .then((response: SPHttpClientResponse): Promise<SPHttpClientResponse> => {
            return response.json();
        }, (error: any): void => {
            return error;
        })
        .catch((error) => {
            return error;
        })
    // });
}

export function getLatestItemId(spHttpClient: SPHttpClient,
    siteUrl: string, listName: string): Promise<number> {
    getAllItems(spHttpClient, siteUrl, listName)
        .then((respose) => {
            console.log("all the items are \n");
            console.log(respose);
        });
    return new Promise<number>((resolve: (itemId: number) => void,
        reject: (error: any) => void): void => {
        spHttpClient.get(
            `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items?$orderby=ID desc&$top=1&$select=id`,
            SPHttpClient.configurations.v1,
            {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            })
            .then((response: SPHttpClientResponse): Promise<{ value: { Id: number }[] }> => {
                return response.json();
            }, (error: any): void => {
                return error;
            })
            .then((response: { value: { Id: number }[] }): void => {
                if (response.value.length === 0) {
                    resolve(-1);
                }
                else {
                    resolve(response.value[0].Id);
                }
            })
            .catch((error) => {
                return error;
            })
    });
}

export function updateItem(data: IListItem, spHttpClient: SPHttpClient,
    siteUrl: string, listName: string): Promise<SPHttpClientResponse> {
    // let latestItemId: number = undefined;
    // return this.getLatestItemId()
    //     .then((itemId: number): Promise<SPHttpClientResponse> => {
    //         if (itemId === -1) {
    //             throw new Error('No items found in the list');
    //         }

    //         latestItemId = itemId;

    //         return spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${latestItemId})?$select=Title,Id`,
    //             SPHttpClient.configurations.v1,
    //             {
    //                 headers: {
    //                     'Accept': 'application/json;odata=nometadata',
    //                     'odata-version': ''
    //                 }
    //             });
    //     })
    //     .then((response: SPHttpClientResponse): Promise<IListItem> => {
    //         return response.json();
    //     })
    //     .then((item: IListItem): void => {

    const body: string = JSON.stringify(data);

    return spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${data.ID})`,
        SPHttpClient.configurations.v1,
        {
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'Content-type': 'application/json;odata=nometadata',
                'odata-version': '',
                'IF-MATCH': '*',
                'X-HTTP-Method': 'MERGE'
            },
            body: body
        })
        .then((response: SPHttpClientResponse) => {
            return data.ID;
        })
        .catch((error) => {
            return error;
        })
    // }, (error: any) => {
    //     return { status: `Error updating item: ${error}` };
    // })
    // .catch((error) => {
    //     return error;
    // });
}

export function deleteItem(spHttpClient: SPHttpClient, siteUrl: string,
    listName: string): Promise<SPHttpClientResponse> {
    let latestItemId: number = undefined;
    let etag: string = undefined;
    return this.getLatestItemId()
        .then((itemId: number): Promise<SPHttpClientResponse> => {
            if (itemId === -1) {
                throw new Error('No items found in the list');
            }

            latestItemId = itemId;

            return spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${latestItemId})?$select=Id`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'odata-version': ''
                    }
                });
        })
        .then((response: SPHttpClientResponse): Promise<IListItem> => {
            etag = response.headers.get('ETag');
            return response.json();
        })
        .then((item: IListItem): Promise<SPHttpClientResponse> => {

            return spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${item.ID})`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'Content-type': 'application/json;odata=verbose',
                        'odata-version': '',
                        'IF-MATCH': etag,
                        'X-HTTP-Method': 'DELETE'
                    }
                });
        })
        .then((response: SPHttpClientResponse) => {
            return {
                status: `Item with ID: ${latestItemId} successfully deleted`
            };
        }, (error: any): void => {
            this.setState({
                status: `Error deleting item: ${error}`,
                items: []
            });
        })
        .catch((error: any) => {
            return Error;
        });
}