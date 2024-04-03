import {Card, CardProps, Tappable} from "@vkontakte/vkui";
import React from "react";
import {IClient} from "../../types";
import {Icon24ChevronRightOutline} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import './style.scss';

interface ClientCardProps extends CardProps {
  client: IClient,
  expandable?: boolean
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  expandable=true,
  ...restProps
}) => {
  const router = useRouteNavigator();

  return (
    <Card {...restProps} className={'ClientCard'}>
      <Tappable onClick={() => {
        if (expandable) {
          router.push('/client/' + client.id)
        }
      }} className={'ClientCard__Tappable'}>
        <div className={'ClientCard__Content'}>
          <div className={'ClientCard--header'}>
            {client.first_name} {client.last_name}
          </div>
          <div className={'ClientCard--description'}>
            {client.phone_number}
          </div>
        </div>
        {expandable &&
          <div className={'ClientCard__Chevron'}>
            <Icon24ChevronRightOutline color={'var(--vkui--color_background_accent_themed)'}/>
          </div>
        }
      </Tappable>
    </Card>
  )
}