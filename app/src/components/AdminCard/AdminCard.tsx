import {Card, CardProps, Tappable} from "@vkontakte/vkui";
import React from "react";
import {IAdmin} from "../../types";
import {Icon24ChevronRightOutline} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import './style.scss';

interface AdminCardProps extends CardProps {
  admin: IAdmin,
  expandable?: boolean
}

export const AdminCard: React.FC<AdminCardProps> = ({
  admin,
  expandable=true,
  ...restProps
}) => {
  const router = useRouteNavigator();

  return (
    <Card {...restProps} className={'AdminCard'}>
      <Tappable onClick={() => {
        if (expandable) {
          router.push('/admin/' + admin.id)
        }
      }} className={'AdminCard__Tappable'}>
        <div className={'AdminCard__Content'}>
          <div className={'AdminCard--header'}>
            {admin.first_name} {admin.last_name}
          </div>
        </div>
        {expandable &&
          <div className={'AdminCard__Chevron'}>
            <Icon24ChevronRightOutline color={'var(--vkui--color_background_accent_themed)'}/>
          </div>
        }
      </Tappable>
    </Card>
  )
}