import {
  trigger,
  transition,
  useAnimation,
  query,
  stagger,
  animate,
  style,
} from '@angular/animations';
import {
  fadeInAnimation,
  fadeOutAnimation,
  slideYTopInAnimation,
  slideXRightOutAnimation,
  slideXRightInAnimation,
  slideYBottomInAnimation,
  slideXLeftInAnimation,
  fadeIn,
} from './animations';

export const fadeInTrigger = trigger('fadeIn', [
  transition(':enter', useAnimation(fadeInAnimation)),
]);

export const fadeInOutTrigger = trigger('fadeInOut', [
  transition(':enter', useAnimation(fadeInAnimation)),
  transition(':leave', useAnimation(fadeOutAnimation)),
]);

export const fadeOutTrigger = trigger('fadeOut', [
  transition(':leave', useAnimation(fadeOutAnimation)),
]);

export const slideYTopInTrigger = trigger('slideYTopIn', [
  transition(':enter', useAnimation(slideYTopInAnimation)),
]);

export const slideXInOutTrigger = trigger('slideXInOut', [
  transition(':enter', useAnimation(slideXRightInAnimation)),
  transition(':leave', useAnimation(slideXRightOutAnimation)),
]);

export const slideXRightInTrigger = trigger('slideXRightIn', [
  transition(':enter', useAnimation(slideXRightInAnimation)),
]);

export const slideXLeftInTrigger = trigger('slideXLeftIn', [
  transition(':enter', useAnimation(slideXLeftInAnimation)),
]);

export const slideYBottomInTrigger = trigger('slideYBottomIn', [
  transition(':enter', useAnimation(slideYBottomInAnimation)),
]);

export const fadeInSequenceTrigger = trigger('fadeInSequence', fadeIn());

export const fadeInOutSequenceTrigger = trigger('fadeInOutSequence', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger(100, [animate('0.3s', style({ opacity: 1 }))]),
      ],

      {
        optional: true,
      }
    ),
    query(':leave', stagger(100, [animate('0.3s', style({ opacity: 0 }))]), {
      optional: true,
    }),
  ]),
]);
