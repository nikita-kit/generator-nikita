import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Button extends Component {

    static propTypes = {
        isSecondary: PropTypes.bool,
        isPrimary: PropTypes.bool,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        onClick: PropTypes.func,
        type: PropTypes.oneOf(['button', 'submit', 'reset']),
        to: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.string,
        ]).isRequired,
    }

    static defaultProps = {
        isSecondary: false,
        isPrimary: false,
        disabled: false,
        className: null,
        type: 'button',
        onClick: null,
        to: null,
    }

    render() {
        const {
            to, onClick, disabled, type, children, className, isPrimary, isSecondary, ...restProps
        } = this.props;

        const classes = classNames('b-button', className, {
            'is-primary': isPrimary,
            'is-secondary': !isPrimary && isSecondary,
        });

        return (
            (to && !disabled) ? (
                <Link to={to} className={classes} {...restProps}>
                    { children }
                </Link>
            ) : (
                // eslint-disable-next-line react/button-has-type, react/jsx-props-no-spreading
                <button onClick={onClick} className={classes} type={type} disabled={disabled} {...restProps}>
                    { children }
                </button>
            )
        );
    }
}
