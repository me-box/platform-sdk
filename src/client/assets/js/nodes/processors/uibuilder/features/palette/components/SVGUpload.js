import React, { PureComponent, PropTypes } from 'react';
import cn from 'classnames';
import isRequiredForA11y from 'react-prop-types/lib/isRequiredForA11y';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import Button from 'react-md/lib/Buttons';
/**
 * The `SVGUpload` component is used as simple styling for the `<input type="file" />`.
 * It will style the input as a raised button by default.
 */
export default class SVGUpload extends PureComponent {
  static propTypes = {
    /**
     * The id for the text field. This is required for a11y and to get the `input type="file"` to
     * open.
     */
    id: isRequiredForA11y(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])),

    /**
     * An optional style to apply.
     */
    style: PropTypes.object,

    /**
     * An optional className to apply.
     */
    className: PropTypes.string,

    /**
     * Boolean if the `SVGUpload` should be styled with the primary color.
     */
    primary: PropTypes.bool,

    /**
     * Boolean if the `SVGUpload` should be styled with the secondary color.
     */
    secondary: PropTypes.bool,

    /**
     * Boolean if the `SVGUpload` should be styled as a flat button instead of a
     * raised button.
     */
    flat: PropTypes.bool,

    /**
     * This should be a comma separated list of Media Types that the `SVGUpload` can
     * accept. If this prop is left blank, any file will be accepted.
     *
     * The values can either be:
     * - A file extension
     * - audio/*
     * - video/*
     * - image/*
     * - any valid [IANA Media Type](http://www.iana.org/assignments/media-types/media-types.xhtml)
     *
     * > NOTE: IE does not enforce this.
     */
    accept: PropTypes.string,

    /**
     * Boolean if multiple files will be accepted.
     */
    multiple: PropTypes.bool,

    /**
     * A label to display on the `SVGUpload`. This will be used with the `AccessibleFakeInkedButton` component to
     * create a `<label>` for the `<input type="file">`.
     */
    label: PropTypes.node.isRequired,

    /**
     * Boolean if the icons hould appear before the label.
     */
    iconBefore: PropTypes.bool,

    /**
     * The icon children to use for the upload icon.
     */
    iconChildren: PropTypes.node,

    /**
     * The icon className to use for the upload icon.
     */
    iconClassName: PropTypes.string,

    /**
     * A function to call when the value of the input changes. This will
     * be triggered when the user selects a new file or cancels the new file selection.
     *
     * This function will be given the new [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList)
     * as an array and the change event. If this is not a multiple file input, only the
     * newly selected File will be given instead of a list of one file. Since this is an
     * `input` tag, the user will not be able to select the same file multiple times unless
     * you manually clear the input's value.
     *
     * > NOTE: If the user hits cancel, null will be given for a single file input.
     *
     * ```js
     * onChange(files, e);
     * ```
     */
    onChange: PropTypes.func.isRequired,

    /**
     * Boolean if the `SVGUpload` is currently disabled.
     */
    disabled: PropTypes.bool,

    /**
     * An optional function to call when they keyup event is triggerred on the file input's label.
     */
    onKeyUp: PropTypes.func,

    /**
     * An optional function to call when they keydown event is triggerred on the file input's label.
     */
    onKeyDown: PropTypes.func,

    /**
     * An optional function to call when they mouseup event is triggerred on the file input's label.
     */
    onMouseUp: PropTypes.func,

    /**
     * An optional function to call when they mousedown event is triggerred on the file input's label.
     */
    onMouseDown: PropTypes.func,

    /**
     * An optional function to call when they mouseover event is triggerred on the file input's label.
     */
    onMouseOver: PropTypes.func,

    /**
     * An optional function to call when they mouseleave event is triggerred on the file input's label.
     */
    onMouseLeave: PropTypes.func,

    /**
     * An optional function to call when they touchend event is triggerred on the file input's label.
     */
    onTouchEnd: PropTypes.func,

    /**
     * An optional function to call when they touchstart event is triggerred on the file input's label.
     */
    onTouchStart: PropTypes.func,
  };

  static defaultProps = {
    label: 'Select a file',
    iconChildren: 'file_upload',
  };

  constructor(props) {
    super(props);
    this.state = { hover: false, pressed: false };
    this._handleChange = this._handleChange.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
  }


  _handleChange(e) {
    const { multiple, onChange } = this.props;
    const { files } = e.target;
    if (!multiple) {
      onChange(files[0] || null, e);
    } else {
      onChange(Array.prototype.slice.call(files), e);
    }
  }


  _handleMouseUp(e) {
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }
  }

  _handleMouseDown(e) {

    if (this.props.onMouseDown) {
      
      this.props.onMouseDown(e);
    }

    //if (!this.props.disabled) {
      this.setState({ pressed: true });
   // }
  }

  render() {
    const { hover, pressed } = this.state;
    
    const {
      style,
      className,
      label,
      iconChildren,
      iconClassName,
      primary,
      secondary,
      flat,
      id,
      iconBefore,
      disabled,
      accept,
      multiple,
      ...props
    } = this.props;
    delete props.onChange;
    delete props.onKeyUp;
    delete props.onKeyDown;
    delete props.onMouseUp;
    delete props.onMouseDown;
    delete props.onMouseOver;
    delete props.onMouseLeave;
    delete props.onTouchStart;
    delete props.onTouchEnd;

    const icon = !iconClassName && !iconChildren
      ? null
      : <FontIcon onClick={this._handleMouseDown} iconClassName={iconClassName}>{iconChildren}</FontIcon>;

    let labelChildren = label;
    if (icon) {
      labelChildren = <IconSeparator label={label} iconBefore={iconBefore}>{icon}</IconSeparator>;
    }

    return (
      <div
        {...props}
        style={style}
        className={cn('md-inline-block md-file-input-container', className)}
      >
        <Button
          component="label"
          htmlFor={id}        
          onClick={this._handleMouseDown}
          
          className={cn(`md-btn md-btn--raised`) }
          style={{textAlign:"center", paddingTop:4}}
        >
        <div style={{padding:7, color:"white", fontSize:"1.6em"}}>⇧</div>
        </Button>

        <input
          ref="file"
          multiple={multiple}
          id={id}
          accept={accept}
          type="file"
          className="md-file-input"
          onChange={this._handleChange}
        />
      </div>
    );
  }
}