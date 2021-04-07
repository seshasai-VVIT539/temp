import * as React from 'react';
import styles from './CrudOperations.module.scss';
import { IListItem } from '../../../Concerns/IListItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Form } from '../../../Components/Form/Form';
import { Display } from '../../../Components/Display/Display';
import { getAllItems, getLatestItem, getLatestItemId } from '../../../Contracts/Services';
import { PrimaryButton } from 'office-ui-fabric-react';

export interface IReactCrudState {
  status: string;
  selectedItem: IListItem | undefined;
  items: IListItem[];
}
export interface ICrudOperationsProps {
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

export default class CrudOperations extends React.Component<ICrudOperationsProps, IReactCrudState> {
  constructor(props: ICrudOperationsProps) {
    super(props);
    this.state = {
      status: "Ready",
      items: [],
      selectedItem: undefined
    }
    this.updateContainer = this.updateContainer.bind(this);
    this.cancelAction = this.cancelAction.bind(this);
    this.getLatestItemId = this.getLatestItemId.bind(this);
    this.createItem = this.createItem.bind(this);
    this.readItem = this.readItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  updateContainer() {
    getAllItems(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
      .then((respose) => {
        console.log("all the items are \n");
        console.log(respose);
      });
  }

  getLatestItemId(): Promise<number> {
    return new Promise<number>((resolve: (itemId: number) => void,
      reject: (error: any) => void): void => {
      this.props.spHttpClient.get(
        `${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$orderby=ID desc&$top=1&$select=id`,
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
          reject(error);
        })
        .then((response: { value: { Id: number }[] }): void => {
          if (response.value.length === 0) {
            resolve(-1);
          }
          else {
            resolve(response.value[0].Id);
          }
        });
    });
  }

  cancelAction(): void {
    this.updateContainer();
    this.setState({
      status: "Ready",
      selectedItem: undefined
    });
  }

  createItem(): void {
    this.setState({
      status: "Create",
      selectedItem: undefined
    });
    // this.setState({
    //   status: 'Creating item...',
    //   items: []
    // });

    // const body: string = JSON.stringify({
    //   'Title': "ItemTitle"//`Item ${new Date()}`
    // });

    // this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items`,
    //   SPHttpClient.configurations.v1,
    //   {
    //     headers: {
    //       'Accept': 'application/json;odata=nometadata',
    //       'Content-type': 'application/json;odata=nometadata',
    //       'odata-version': ''
    //     },
    //     body: body
    //   })
    //   .then((response: SPHttpClientResponse): Promise<IListItem> => {
    //     return response.json();
    //   })
    //   .then((item: IListItem): void => {
    //     this.setState({
    //       status: `Item '${item.Title}' (ID: ${item.ID}) successfully created`,
    //       items: []
    //     });
    //   }, (error: any): void => {
    //     this.setState({
    //       status: 'Error while creating the item: ' + error,
    //       items: []
    //     });
    //   });
  }

  readItem(): void {
    getLatestItem(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
      .then((item) => {
        this.setState({
          status: "read",
          selectedItem: item
        })
      });
    // this.getLatestItemId()
    //   .then((itemId: number): Promise<SPHttpClientResponse> => {
    //     if (itemId === -1) {
    //       throw new Error('No items found in the list');
    //     }

    //     this.setState({
    //       status: `Loading information about item ID: ${itemId}...`,
    //       items: []
    //     });
    //     return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${itemId})?$select=Title,Id`,
    //       SPHttpClient.configurations.v1,
    //       {
    //         headers: {
    //           'Accept': 'application/json;odata=nometadata',
    //           'odata-version': ''
    //         }
    //       });
    //   })
    //   .then((response: SPHttpClientResponse): Promise<IListItem> => {
    //     return response.json();
    //   })
    //   .then((item: IListItem): void => {
    //     this.setState({
    //       status: "read",
    //       selectedItem: item
    //     });
    //   }, (error: any): void => {
    //     this.setState({
    //       status: 'Loading latest item failed with error: ' + error,
    //       items: []
    //     });
    //   });
  }

  updateItem(): void {
    this.setState({
      status: "Update"
    });

    let latestItemId: number = undefined;

    getLatestItemId(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
      .then((itemId: number): Promise<SPHttpClientResponse> => {
        if (itemId === -1) {
          throw new Error('No items found in the list');
        }

        latestItemId = itemId;
        this.setState({
          status: `Loading information about item ID: ${latestItemId}...`,
          items: []
        });

        return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${latestItemId})?$select=Title,Id`,
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
      .then((item: IListItem): void => {
        this.setState({
          status: "update",
          selectedItem: item
        });

        // const body: string = JSON.stringify({
        //   'Title': `Updated Item ${new Date()}`
        // });

        // this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.ID})`,
        //   SPHttpClient.configurations.v1,
        //   {
        //     headers: {
        //       'Accept': 'application/json;odata=nometadata',
        //       'Content-type': 'application/json;odata=nometadata',
        //       'odata-version': '',
        //       'IF-MATCH': '*',
        //       'X-HTTP-Method': 'MERGE'
        //     },
        //     body: body
        //   })
        //   .then((response: SPHttpClientResponse): void => {
        //     this.setState({
        //       status: `Item with ID: ${latestItemId} successfully updated`,
        //       items: []
        //     });
        //   }, (error: any): void => {
        //     this.setState({
        //       status: `Error updating item: ${error}`,
        //       items: []
        //     });
        //   });
      });
  }

  deleteItem(): void {
    if (!window.confirm('Are you sure you want to delete the latest item?')) {
      return;
    }

    this.setState({
      status: 'Loading latest items...',
      items: []
    });

    let latestItemId: number = undefined;
    let etag: string = undefined;
    getLatestItemId(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
      .then((itemId: number): Promise<SPHttpClientResponse> => {
        if (itemId === -1) {
          throw new Error('No items found in the list');
        }

        latestItemId = itemId;
        this.setState({
          status: `Loading information about item ID: ${latestItemId}...`,
          items: []
        });

        return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${latestItemId})?$select=Id`,
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
        this.setState({
          status: `Deleting item with ID: ${latestItemId}...`,
          items: []
        });

        return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.id})`,
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
      .then((response: SPHttpClientResponse): void => {
        this.setState({
          status: `Item with ID: ${latestItemId} successfully deleted`,
          items: []
        });
      }, (error: any): void => {
        this.setState({
          status: `Error deleting item: ${error}`,
          items: []
        });
      });
  }

  render() {
    const items: JSX.Element[] = this.state.items.map((item: IListItem, i: number): JSX.Element => {
      return (
        <li>{item.title} ({item.id}) </li>
      );
    });
    return (
      <div className={styles.crudOperations}>
        {this.state.status == "Ready" &&
          <div>
            <p className={styles.description}>{escape(this.props.listName)}</p>
            <div className="ms-Grid">

              <div className="ms-Grid-row">
                <div className="ms-Grid-col" >
                  <PrimaryButton text="Create Item" onClick={this.createItem} />
                </div>
                <div className="ms-Grid-col" >
                  <PrimaryButton text="Read Item" onClick={this.readItem} />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col" >
                  <PrimaryButton text="Update item" onClick={() => this.updateItem()} />
                </div>
                <div className="ms-Grid-col" >
                  <PrimaryButton text="Delete item" onClick={() => this.deleteItem()} />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col" aria-colspan={2}>
                  {this.state.status}
                  <ul>
                    {items}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        }
        {
          (this.state.status == "Create" || this.state.status == "Update") &&
          <Form operation={this.state.status}
            item={this.state.selectedItem}
            cancel={this.cancelAction}
            spHttpClient={this.props.spHttpClient}
            listName={this.props.listName}
            siteUrl={this.props.siteUrl}
          />
        }
        {
          this.state.status == "read" &&
          <Display
            back={this.cancelAction}
            item={this.state.selectedItem}
          />
        }
      </div >
    );
  }
}
