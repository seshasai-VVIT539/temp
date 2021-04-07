import { Label } from "office-ui-fabric-react";
import * as React from "react";
import { IListItem, Keys } from "../../Concerns/IListItem";
import styles from "./Display.module.scss";

interface IDisplayProps {
    back: () => void,
    item: IListItem
}

export class Display extends React.Component<IDisplayProps>{
    constructor(props: IDisplayProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className={styles.table}>
                    <div>
                        <Label>
                            ID&nbsp;:&nbsp;{this.props.item.id}
                        </Label>
                    </div>
                    <div>
                        <Label>
                            Name&nbsp;:&nbsp;{this.props.item[Keys.Title]}
                        </Label>
                    </div>
                    <div>
                        <Label>
                            Last Name&nbsp;:&nbsp;{this.props.item[Keys.LastName]}
                        </Label>
                    </div>
                    <div>
                        <Label>
                            Certifications&nbsp;:&nbsp;{this.props.item[Keys.Certifications]}
                        </Label>
                    </div>
                    <div>
                        <Label>
                            Department&nbsp;:&nbsp;{this.props.item[Keys.Department]}
                        </Label>
                    </div>
                    <div>
                        <Label>
                            Age&nbsp;:&nbsp;{this.props.item[Keys.Age]}
                        </Label>
                    </div>
                    <div>
                        <Label>
                            Family Income&nbsp;:&nbsp;{this.props.item[Keys.FamilyIncome]}
                        </Label>
                    </div>

                    <div className="row">
                        <div className="cell">
                            <input type="button"
                                onClick={() => { this.props.back() }}
                                value="Back"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}