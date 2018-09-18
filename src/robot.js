import React from "react";
class Robot extends React.Component {
    render() {
        const { direction } = this.props;
        return <span className={`robot ${direction}`}>⬆️</span>
    }
};
export default Robot;