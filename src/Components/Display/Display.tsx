import * as React from "react";
import { IListItem } from "../../Concerns/IListItem";
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
                    <div className="row">
                        <div className="cell">
                            ID
                        </div>
                        <div className="cell">
                            {this.props.item !== undefined && this.props.item.ID}
                        </div>
                    </div>
                    <div className="row">
                        <div className="cell">
                            Title
                        </div>
                        <div className="cell">
                            {this.props.item !== undefined && this.props.item.title}
                        </div>
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