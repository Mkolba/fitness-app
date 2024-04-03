import {Card, CardProps, Tappable} from "@vkontakte/vkui";
import React from "react";
import {ITrainer} from "../../types";
import './style.scss';
import {Icon24ChevronRightOutline} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

interface TrainerCardProps extends CardProps {
  trainer: ITrainer,
  expandable?: boolean
}

export const TrainerCard: React.FC<TrainerCardProps> = ({
  trainer,
  expandable=true,
  ...restProps
}) => {
  const router = useRouteNavigator();

  return (
    <Card {...restProps} className={'TrainerCard'}>
      <Tappable onClick={() => {
        if (expandable) {
          router.push('/trainer/' + trainer.id)
        }
      }} className={'TrainerCard__Tappable'}>
        <div className={'TrainerCard__Content'}>
          <div className={'TrainerCard--header'}>
            {trainer.first_name} {trainer.last_name}
          </div>
        </div>
        {expandable &&
          <div className={'TrainerCard__Chevron'}>
            <Icon24ChevronRightOutline color={'var(--vkui--color_background_accent_themed)'}/>
          </div>
        }
      </Tappable>
    </Card>
  )
}