import React, { Component } from 'react';
import logging from 'node-logging-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Checkbox extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        hideLabel: PropTypes.bool,
        className: PropTypes.string,
        value: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
    }

    static defaultProps = {
        className: null,
        hideLabel: false,
        value: false,
        disabled: false,
        onChange: () => {},
    }

    constructor(props) {
        super(props);
        logging.applyLogging(this, 'Checkbox', false);
        this.logDebug('init:', props);
    }

    onChange = (event) => {
        this.props.onChange({
            value: event.target.checked,
            id: this.props.id,
            event,
        });
    }

    render() {
        const {
            id, label, value, hideLabel, className, ...restProps
        } = this.props;

        return (
            <label className={classNames('b-checkbox', className)} htmlFor={id}>
                <input
                    id={id}
                    type="checkbox"
                    className="checkbox-field"
                    checked={value}
                    {...restProps} // eslint-disable-line react/jsx-props-no-spreading
                    onChange={this.onChange}
                />
                <span className="checkbox-label">
                    { !hideLabel && label}
                </span>
            </label>
        );
    }
}

export default Checkbox;
