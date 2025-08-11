import * as SiIcons from 'react-icons/si';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as DiIcons from 'react-icons/di';
import * as TB from "react-icons/tb";

function Icon(props) {
    const {language} = props
    
    const getIcon = (language) => {

        const color = language?.color;
        const iconName = language?.icon;
        if (SiIcons[iconName]) {
            const Icon = SiIcons[iconName];
            return <Icon color={color} {...props} />;
        } else if (FaIcons[iconName]) {
            const Icon = FaIcons[iconName];
            return <Icon color={color} {...props}/>;
        } else if (Fa6Icons[iconName]) {
            const Icon = Fa6Icons[iconName];
            return <Icon color={color} {...props}/>;
        } else if (DiIcons[iconName]) {
            const Icon = DiIcons[iconName];
            return <Icon color={color} {...props}/>;
        } else if (TB[iconName]) { 
            const Icon = TB[iconName];
            return <Icon color={color} {...props}/>;
        }
        // Si aucune icône trouvée, retourne null
        return null;
    };

    return (
        <>
            {getIcon(language)}
        </> 
    );
}

export default Icon;