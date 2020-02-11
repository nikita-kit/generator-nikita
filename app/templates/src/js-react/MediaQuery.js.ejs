import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import logging from 'node-logging-js';
import ReactMedia from 'react-media';

/**
 * media query component to match against foundation breakpoints
 *
 * Usage:
 *
 * <MediaQuery match="medium down">medium and smaller!</MediaQuery>
 *
 * <MediaQuery match="portrait">
 *     <Element />
 *     <Element />
 * </MediaQuery>
 *
 * <MediaQuery match="retina">
 *     {match => ((match)
 *         ? <Element />
 *         : <Element />
 *     )}
 * </MediaQuery>
 */
class MediaQuery extends Component {

    static propTypes = {
        match: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.element),
            PropTypes.func,
        ]).isRequired,
    }

    /* a breakpoint max value is 0.2px under the next breakpoint (0.02 / 16 = 0.00125) */
    static maxBreakpointSubtrahend = 0.00125

    static breakpoints = []

    constructor(props) {
        super(props);
        logging.applyLogging(this, 'MediaQuery', false);
        if (MediaQuery.breakpoints.length === 0) {
            this.initialize();
        }
    }

    initialize() {
        const element = document.head.querySelector('.foundation-mq');

        if (!element) {
            this.logError('Foundation meta element missing. Please add <meta class="foundation-mq"> to document head.');
            return;
        }

        const extractedStyles = window.getComputedStyle(element).getPropertyValue('font-family');

        if (!extractedStyles.includes('em&')) {
            this.logError('Foundation breakpoint styles missing. Please re-add class ".foundation-mq" to your scss/_foundation.scss file.');
            return;
        }

        const namedQueries = this.parseStyleToObject(extractedStyles);

        Object.keys(namedQueries).forEach((key) => {
            MediaQuery.breakpoints.push({
                name: key,
                value: Number.parseFloat(namedQueries[key]),
            });
        });

        MediaQuery.breakpoints.sort((itemA, itemB) => (itemA.value - itemB.value));
        this.logDebug('initialized breakpoints (in em):', MediaQuery.breakpoints);
    }

    parseStyleToObject(extractedStyles = '') {
        const stylesString = extractedStyles.trim().slice(1, -1); // browsers re-quote string style values

        return stylesString.split('&').reduce((acc, param) => {
            let [key, value] = param.replace(/\+/g, ' ').split('=');
            key = decodeURIComponent(key);
            value = typeof value === 'undefined' ? null : decodeURIComponent(value);

            if (!acc[key]) {
                acc[key] = value;
            } else if (Array.isArray(acc[key])) {
                acc[key].push(value);
            } else {
                acc[key] = [acc[key], value];
            }
            return acc;
        }, {});
    }

    calculateQuery(term, modifier = null) {
        if (term === 'landscape' || term === 'portrait') {
            return `(orientation: ${term})`;
        }
        if (term === 'retina') {
            return '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)';
        }

        const breakpoint = MediaQuery.breakpoints.find(query => (term === query.name));
        const breakpointIndex = MediaQuery.breakpoints.indexOf(breakpoint);
        let minBreakpoint = null;
        let maxBreakpoint = null;

        if (!breakpoint) {
            throw new Error(`breakpoint "${term}" not supported`);
        }

        if (modifier === 'only') {
            if (breakpointIndex === 0) {
                maxBreakpoint = MediaQuery.breakpoints[breakpointIndex + 1];
            } else if (breakpointIndex === (MediaQuery.breakpoints.length - 1)) {
                minBreakpoint = breakpoint;
            } else {
                minBreakpoint = breakpoint;
                maxBreakpoint = MediaQuery.breakpoints[breakpointIndex + 1];
            }
        } else if (modifier === 'down') {
            if (breakpointIndex === (MediaQuery.breakpoints.length - 1)) {
                [minBreakpoint] = MediaQuery.breakpoints;
            } else {
                maxBreakpoint = MediaQuery.breakpoints[breakpointIndex + 1];
            }
        } else {
            minBreakpoint = breakpoint;
        }

        if (minBreakpoint && maxBreakpoint) {
            return `screen and (min-width: ${minBreakpoint.value}em) and (max-width: ${maxBreakpoint.value - MediaQuery.maxBreakpointSubtrahend}em)`;
        }
        if (maxBreakpoint) {
            return `screen and (max-width: ${maxBreakpoint.value - MediaQuery.maxBreakpointSubtrahend}em)`;
        }
        return `screen and (min-width: ${minBreakpoint.value}em)`;
    }

    render() {
        const { match, children } = this.props;
        const [term, modifier] = match.trim().split(' ');
        const query = this.calculateQuery(term, modifier);

        this.logDebug(`calculated query for "${match}":`, query);

        if (typeof children === 'function') {
            return (
                <ReactMedia query={query}>
                    { children }
                </ReactMedia>
            );
        }

        return (
            <ReactMedia
                query={query}
                render={() => (<Fragment>{ children }</Fragment>)}
            />
        );
    }
}

export default MediaQuery;
