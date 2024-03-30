import React, { ReactNode, MouseEvent } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

// Material UI
import { styled, IconButton } from "@mui/material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    root: {
        order: "0",
        cursor: "pointer",
        borderRadius: "0",
        padding: "0px",

        "& svg": {
            width: "1em",
            height: "1em",
            fontSize: "30px",
            fill: theme.palette.primary.main,
            stroke: "transparent",
        },

        "&.outline": {
            "& svg": {
                fill: "transparent",
                stroke: theme.palette.primary.main,
            },
        },
    },
    disabled: {
        opacity: "0.2",
    },
}));

interface FusionButtonIconProps {
    children?: ReactNode;
    icon?: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    template?: string;
}

const FusionButtonIcon: React.FC<FusionButtonIconProps> = ({ children, icon, onClick, className = "", template = "", ...other }) => {
    return (
        <StyledIconButton
            className={clsx(`${className} ${template}`, {})}
            onClick={onClick}
            {...other}
        >
            {icon || children}
        </StyledIconButton>
    );
};

FusionButtonIcon.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default FusionButtonIcon;
