import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ item, isOpen, setOpenMenuItem, closeCurrentSubMenu }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;

    const handleClick = (e) => {
        
        if (hasSubItems) {
            e.preventDefault();
         // Prevent default link behavior for parent items
            if (isOpen) {
                closeCurrentSubMenu();
            } else {
                setOpenMenuItem();
            }
        }
    };

    return (
        <li className="menu-item">
            <Link to={item.path} 
                className={`
                    menu-link ${hasSubItems ? ' border-gray-800' : ''} ${isOpen ? 'bg-gray-100' : ''} 
                    flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-100 ${location.pathname === item.path ? 'bg-gray-100' : ''}
                    `}
                
                onClick={handleClick}
                aria-expanded={hasSubItems ? isOpen : undefined}
            >
            <item.icon className="w-6 h-6 text-gray-500" />
            <span className="ml-3">{item.name}</span>
                {hasSubItems && (
                    <span className="text-sm transition-transform duration-300 ease-in-out ml-3">
                        {isOpen ? '▲' : '▼'}
                    </span>
                )}
            </Link>
            {hasSubItems && (
                <ul className={`
                 overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'max-h-96' : 'max-h-0'}
                rounded-lg
                `}>
                    {item.subItems.map((subItem, index) => (
                        <li key={subItem.id}>
                            <Link to={subItem.path || '#'} 
                            className={`flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-300 ${location.pathname === subItem.path ? 'bg-gray-100' : ''}`}
                            >{subItem.name} </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default MenuItem;