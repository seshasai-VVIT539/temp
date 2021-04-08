import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";


export interface IDialogBoxProps {
    title: string,
    subText: string,
    ok: () => void,
    cancel: () => void
}
interface IDialogBoxState {
    // hideDialog: boolean,
    dialogContentProps: {
        type: DialogType,
        title: string,
        closeButtonAriaLabel: string,
        subText: string
    }
}

export class DialogBox extends React.Component<IDialogBoxProps, IDialogBoxState> {
    constructor(props) {
        super(props);
        let dialogContent = {
            type: DialogType.normal,
            title: this.props.title,
            closeButtonAriaLabel: 'Close',
            subText: this.props.subText
        };
        this.state = {
            // hideDialog: false,
            dialogContentProps: dialogContent

        }
        // this.toggleHideDialog = this.toggleHideDialog.bind(this);
    }

    // toggleHideDialog() {
    //     this.setState({
    //         hideDialog: true
    //     });
    //     this.props.cancel();
    // }

    render() {
        return (
            <>
                <Dialog
                    // hidden={this.state.hideDialog}
                    hidden={false}
                    // onDismiss={this.toggleHideDialog}
                    onDismiss={() => {
                        this.props.cancel();
                    }}
                    dialogContentProps={this.state.dialogContentProps}
                >
                    <DialogFooter>
                        <PrimaryButton onClick={() => {
                            // this.toggleHideDialog();
                            this.props.ok();
                        }}
                            text="Ok"
                        />
                        <DefaultButton onClick={() => {
                            // this.toggleHideDialog();
                            this.props.cancel();
                        }}
                            text="Cancel"
                        />
                    </DialogFooter>
                </Dialog>
            </>
        );
    }
}