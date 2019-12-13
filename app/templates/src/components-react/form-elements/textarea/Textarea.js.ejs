import React, { Component } from 'react';
import logging from 'node-logging-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Textarea extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        hideLabel: PropTypes.bool,
        className: PropTypes.string,
        value: PropTypes.string,
        rows: PropTypes.number,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
    }

    static defaultProps = {
        className: null,
        hideLabel: false,
        value: '',
        rows: 6,
        disabled: false,
        onChange: () => {},
        onBlur: () => {},
    }

    constructor(props) {
        super(props);
        logging.applyLogging(this, 'Textarea', false);
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
            <div className={classNames('b-textarea', className)}>
                <label
                    htmlFor={id}
                    className={classNames('textarea-label', {
                        'u-visuallyhidden': hideLabel,
                    })}
                >
                    {label}
                </label>
                <textarea
                    id={id}
                    className="textarea-field"
                    {...restProps} // eslint-disable-line react/jsx-props-no-spreading
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default Textarea;
