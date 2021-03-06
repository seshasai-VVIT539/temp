import { IListItem } from "../Concerns/IListItem";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

function toPostBody(data: IListItem) {
    let postBody = {
        "Title": data.title,
        "LastName": data.lastName,
        "Certifications": data.certifications,
        "Department": data.department,
        "Age": data.age,
        "Family_x0020_Income": data.familyIncome,
        "Date_x0020_of_x0020_Birth": data.dOB,
        "Married": data.married == "Yes" ? true : false,
    }
    if (data.linkedIn.length != 0) {
        postBody["Linkedin_x0020_Profile"] = {
            'Description': 'Linkedin Profile',
            'Url': data.linkedIn
        }
    }
    return postBody;
}

function toListItem(item: any): IListItem {
    let newitem: IListItem = {
        id: item["Id"],
        title: item["Title"],
        lastName: item["LastName"],
        certifications: item["Certifications"],
        department: item["Department"],
        age: item["Age"],
        familyIncome: item["Family_x0020_Income"],
        dOB: item["Date_x0020_of_x0020_Birth"],
        married: item["Married"] == true ? "Yes" : "No",
        linkedIn: item["Linkedin_x0020_Profile"]["Url"],
        photo: undefined
    };
    return newitem;
}

export function createItem(
    data: IListItem,
    spHttpClient: SPHttpClient,
    siteUrl: string,
    listName: string
): Promise<SPHttpClientResponse> {
    let postBody = {
        "Title": data.title,
        "LastName": data.lastName,
        "Certifications": data.certifications,
        "Department": data.department,
        "Age": data.age,
        "Family_x0020_Income": data.familyIncome,
        "Married": data.married == "Yes" ? true : false,
    };
    if (data.dOB) {
        postBody["Date_x0020_of_x0020_Birth"] = data.dOB.toJSON().slice(0, 10);
    }
    if (data.linkedIn != undefined && data.linkedIn.length != 0) {
        postBody["Linkedin_x0020_Profile"] = {
            'Description': 'Linkedin Profile',
            'Url': data.linkedIn
        }
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
            return item.id;
        })
        .catch((error) => {
            return error
        });
}

export function getAllItems(spHttpClient: SPHttpClient,
    siteUrl: string,
    listName: string
): Promise<SPHttpClientResponse> {
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
    let postBody = {
        "Title": data.title,
        "LastName": data.lastName,
        "Certifications": data.certifications,
        "Department": data.department,
        "Age": data.age,
        "Family_x0020_Income": data.familyIncome,
        "Married": data.married == "Yes" ? true : false,
    };
    if (data.dOB) {
        postBody["Date_x0020_of_x0020_Birth"] = data.dOB.toJSON().slice(0, 10);
    }
    if (data.linkedIn != undefined && data.linkedIn.length != 0) {
        postBody["Linkedin_x0020_Profile"] = {
            'Description': 'Linkedin Profile',
            'Url': data.linkedIn
        }
    }
    const body: string = JSON.stringify(postBody);

    return spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${data.id})`,
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
            return data.id;
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
    listName: string): Promise<string> {

    let latestItemId: number = undefined;
    let etag: string = undefined;
    return getLatestItemId(spHttpClient, siteUrl, listName)
        .then((itemId: number): Promise<SPHttpClientResponse> => {
            if (itemId === -1) {
                throw new Error('No items found in the list');
            }

            //     latestItemId = itemId;

            //     return spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})?$select=Id`,
            //         SPHttpClient.configurations.v1,
            //         {
            //             headers: {
            //                 'Accept': 'application/json;odata=nometadata',
            //                 'odata-version': ''
            //             }
            //         });
            // })
            // .then((response: SPHttpClientResponse): Promise<IListItem> => {
            //     etag = response.headers.get('ETag');
            //     return response.json();
            // })
            // .then((item: IListItem): Promise<SPHttpClientResponse> => {

            return spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'Content-type': 'application/json;odata=verbose',
                        'odata-version': '',
                        'IF-MATCH': '*',
                        'X-HTTP-Method': 'DELETE'
                    }
                });
        })
        .then((response: SPHttpClientResponse) => {
            return `Item with ID: ${latestItemId} successfully deleted`
        }, (error: any): void => {
            return error;
        })
        .catch((error: any) => {
            return error;
        });
}

export function getLatestItem(spHttpClient: SPHttpClient,
    siteUrl: string,
    listName: string
): Promise<any> {
    return getLatestItemId(spHttpClient, siteUrl, listName)
        .then((itemId: number): Promise<any> => {
            return spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'odata-version': ''
                    }
                });
        })
        .then((response: SPHttpClientResponse): Promise<IListItem> => {
            return response.json();
        })
        .then((item: any) => {
            let newitem: IListItem = {
                id: item["Id"],
                title: item["Title"],
                lastName: item["LastName"],
                certifications: item["Certifications"],
                department: item["Department"],
                age: item["Age"],
                familyIncome: item["Family_x0020_Income"],
                dOB: item["Date_x0020_of_x0020_Birth"],
                married: item["Married"] == true ? "Yes" : "No",
                linkedIn: undefined,
                photo: undefined
            };
            if (item["Linkedin_x0020_Profile"] != undefined &&
                item["Linkedin_x0020_Profile"]["Url"] != undefined) {
                newitem.linkedIn = item["Linkedin_x0020_Profile"]["Url"];
            }
            let str = item["Date_x0020_of_x0020_Birth"];
            if (str) {
                let temp: Date = new Date(
                    parseInt(str.slice(0, 4)),
                    parseInt(str.slice(5, 7)),
                    parseInt(str.slice(8, 10))
                );
                newitem.dOB = temp;
            }
            return newitem;
        }, (error: any): void => {
            return error;
        })
        .catch((error) => {
            return error;
        });
}