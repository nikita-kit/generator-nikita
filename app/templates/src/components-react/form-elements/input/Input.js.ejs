import React, { Component } from 'react';
import logging from 'node-logging-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Input extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        hideLabel: PropTypes.bool,
        className: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
    }

    static defaultProps = {
        className: null,
        hideLabel: false,
        type: 'text',
        value: '',
        placeholder: null,
        disabled: false,
        onChange: () => {},
        onBlur: () => {},
    }

    constructor(props) {
        super(props);
        logging.applyLogging(this, 'Input', false);
        this.logDebug('init:', props);
    }

    onChange = (event) => {
        this.props.onChange({
            value: event.target.value,
            id: this.props.id,
            event,
        });
    }

    render() {
        const {
            id, label, hideLabel, className, ...restProps
        } = this.props;

        return (
            <div className={classNames('b-input', className)}>
                <label
                    htmlFor={id}
                    className={classNames('input-label', {
                        'u-visuallyhidden': hideLabel,
                    })}
                >
                    {label}
                </label>
                <input
                    id={id}
                    className="input-field"
                    {...restProps} // eslint-disable-line react/jsx-props-no-spreading
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default Input;
