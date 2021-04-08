import * as React from 'react';
import styles from './CrudOperations.module.scss';
import { IListItem } from '../../../Concerns/IListItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Form } from '../../../Components/Form/Form';
import { Display } from '../../../Components/Display/Display';
import { deleteItem, getAllItems, getLatestItem, getLatestItemId } from '../../../Contracts/Services';
import { PrimaryButton } from 'office-ui-fabric-react';
import { DialogBox, IDialogBoxProps } from '../../../Components/DialogBox';

export interface IReactCrudState {
  status: string;
  selectedItem: IListItem | undefined;
  items: IListItem[];
  dialogProps: IDialogBoxProps;
  dialogVisibility: boolean
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
      dialogProps: undefined,
      dialogVisibility: false,
      selectedItem: undefined
    }
    this.cancelAction = this.cancelAction.bind(this);
    // this.getLatestItemId = this.getLatestItemId.bind(this);
    this.createItem = this.createItem.bind(this);
    this.readItem = this.readItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteClicked = this.deleteClicked.bind(this);
  }

  // getLatestItemId(): Promise<number> {
  //   return new Promise<number>((resolve: (itemId: number) => void,
  //     reject: (error: any) => void): void => {
  //     this.props.spHttpClient.get(
  //       `${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$orderby=ID desc&$top=1&$select=id`,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers: {
  //           'Accept': 'application/json;odata=nometadata',
  //           'odata-version': ''
  //         }
  //       })
  //       .then((response: SPHttpClientResponse): Promise<{ value: { Id: number }[] }> => {
  //         return response.json();
  //       }, (error: any): void => {
  //         reject(error);
  //       })
  //       .then((response: { value: { Id: number }[] }): void => {
  //         if (response.value.length === 0) {
  //           resolve(-1);
  //         }
  //         else {
  //           resolve(response.value[0].Id);
  //         }
  //       });
  //   });
  // }

  cancelAction(): void {
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
  }

  readItem(): void {
    getLatestItem(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
      .then((item) => {
        this.setState({
          status: "read",
          selectedItem: item
        })
      });
  }

  updateItem(): void {
    getLatestItem(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
      .then((item) => {
        this.setState({
          status: "Update",
          selectedItem: item
        });
      })
      .catch((error) => {
        this.setState({
          status: error
        })
      });
  }

  deleteClicked(): void {
    let dialogBoxProps: IDialogBoxProps = {
      title: "Delete Item",
      subText: "Are you sure to delete item ?",
      ok: this.deleteItem,
      cancel: this.cancelAction
    };
    this.setState({
      dialogVisibility: true,
      dialogProps: dialogBoxProps
    })
  }

  deleteItem(): void {
    // if (!window.confirm('Are you sure you want to delete the latest item?')) {
    //   return;
    // }

    deleteItem(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
      .then((response) => {
        console.log(response);
        this.setState({
          status: "Ready",
          dialogProps: undefined,
          dialogVisibility: false
        })
      })
      .catch((error) => {
        this.setState({
          status: error,
          dialogProps: undefined,
          dialogVisibility: false
        })
      });
    // getLatestItemId(this.props.spHttpClient, this.props.siteUrl, this.props.listName)
    //   .then((itemId: number): Promise<SPHttpClientResponse> => {
    //     if (itemId === -1) {
    //       throw new Error('No items found in the list');
    //     }

    //     // latestItemId = itemId;
    //     // this.setState({
    //     //   status: `Loading information about item ID: ${latestItemId}...`,
    //     //   items: []
    //     // });

    //   //   return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${latestItemId})?$select=Id`,
    //   //     SPHttpClient.configurations.v1,
    //   //     {
    //   //       headers: {
    //   //         'Accept': 'application/json;odata=nometadata',
    //   //         'odata-version': ''
    //   //       }
    //   //     });
    //   // })
    //   // .then((response: SPHttpClientResponse): Promise<IListItem> => {
    //   //   etag = response.headers.get('ETag');
    //   //   return response.json();
    //   // })
    //   // .then((item: IListItem): Promise<SPHttpClientResponse> => {
    //   //   this.setState({
    //   //     status: `Deleting item with ID: ${latestItemId}...`,
    //   //     items: []
    //   //   });

    //     return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${itemId})`,
    //       SPHttpClient.configurations.v1,
    //       {
    //         headers: {
    //           'Accept': 'application/json;odata=nometadata',
    //           'Content-type': 'application/json;odata=verbose',
    //           'odata-version': '',
    //           'IF-MATCH': etag,
    //           'X-HTTP-Method': 'DELETE'
    //         }
    //       });
    //   })
    //   .then((response: SPHttpClientResponse): void => {
    //     this.setState({
    //       status: `Item with ID: ${latestItemId} successfully deleted`,
    //       items: []
    //     });
    //   }, (error: any): void => {
    //     this.setState({
    //       status: `Error deleting item: ${error}`,
    //       items: []
    //     });
    //   });
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
                  <PrimaryButton text="Delete item" onClick={() => this.deleteClicked()} />
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
        {
          this.state.dialogVisibility &&
          <DialogBox
            title={this.state.dialogProps.title}
            subText={this.state.dialogProps.subText}
            ok={this.state.dialogProps.ok}
            cancel={this.state.dialogProps.cancel}
          />
        }
      </div >
    );
  }
}
