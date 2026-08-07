import venkat from '../assets/testimonials/venkat.webp';
import rishabh from '../assets/testimonials/rishabh.webp';
import arvind from '../assets/testimonials/arvind.webp';
import vidya from '../assets/testimonials/vidya.webp';
import saurav from '../assets/testimonials/saurav.webp';
import neha from '../assets/testimonials/neha.webp';
import ishan from '../assets/testimonials/ishan.webp';

export interface Testimonial {
  name: string;
  city: string;
  avatar: ImageMetadata;
  quote: string;
  tourSlug: string;
  tourName: string;
}

export const testimonialsByJungle: Record<string, Testimonial[]> = {
  tadoba: [
    {
      name: 'Venkat Palakodety',
      city: 'Hyderabad',
      avatar: venkat,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      quote:
        "We were fortunate to get in touch Wild Excursions Hardik Ji for our Tadoba visit. We were team of 16 people with quite a few demands in terms of stay, food, conference room and of course sighting of tigers during Safari. Hardik made wonderful arrangements and met all our requirements and we did see 5 tigers. The stay was excellent, food was amazing and arrangements were immaculate. Hardik was in touch with us continuously during our stay in Tadoba. He was flexible and met our on the fly requirements with alacrity. Our overall experience was great and strongly recommend Wild Excursions to take care of safari visits.",
    },
    {
      name: 'Aravind Sivakumar',
      city: 'Mumbai',
      avatar: arvind,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      quote:
        'Extremely well planned Tadoba trip with zero glitches. We had a great time with some amazing sightings. Hardik carefully crafted our safari experience and accompanied us on all safaris. His knowledge of the park and the tigers is amazing and made our trip even more interesting.',
    },
    {
      name: 'Vidya Barde',
      city: 'Nagpur',
      avatar: vidya,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      quote:
        'We had a lifetime experience during the Safari at Kesala Ghat. Hardik was very helpful and made sure the process is smooth. He was very thorough with the instructions and made sure there are no impediments during our visit. We would recommend Hardik and would like to avail his service for the next time we book!',
    },
    {
      name: 'Sourav Das',
      city: 'Hyderabad',
      avatar: saurav,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      quote:
        'Everything, starting from stay to safari arrangements and the complete experience I had with Hardik is superb. Bagh Kothi is a lovely resort. Definitely a first preference for those staying at Kolara side. This is my 3rd visit to Tadoba and was the best one. Any day anytime my preference will be to book with Wild Excursions and enjoy the trip hassle free.',
    },
    {
      name: 'Neha Vaidya',
      city: 'Mumbai',
      avatar: neha,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      quote:
        'Excellent experience from start to finish. Thank you for organizing an amazing trip, Hardik. You have been great and honest at communicating and suggesting things and very easy to reach at all times. Overall super experience — all thanks to your knowledge and experience we could spot 5 tigers for the first time after doing so many safaris. This was the best and most memorable.',
    },
    {
      name: 'Ishaan Deshmukh',
      city: 'Mumbai',
      avatar: ishan,
      tourSlug: 'tadoba-tiger-safari',
      tourName: 'Tadoba Tiger Safari',
      quote:
        "Booked jungle safari with Wild Excursions during 7th-8th Apr'23. Hardik from Wild Excursions was very helpful throughout the booking, resort selection, cab pick up-drop, and gypsy booking process. Had a wonderful time at Nimbde gate and Kolara gate. Sighted 3 tigers, a bear, a crocodile, along with other regular animals.",
    },
  ],
  karanhdhla: [
    {
      name: 'Rishabh Lakhotiya',
      city: 'Nagpur',
      avatar: rishabh,
      tourSlug: 'karanhdhla-wildlife-safari',
      tourName: 'Karanhdhla Wildlife Safari',
      quote:
        'It was a nice plan organized by Wild Excursions with confirmed sightings of T6 and cubs at Gothangaon, thanks to the knowledge and networks Hardik has. Great energy and positive vibes with a homestay having tasty and homemade, locally popular dishes. If you are planning a visit to UKTR, go with Wild Excursions — as the name suggests, it is clearly a cub-special safari tour. Thanks for this awesome plan.',
    },
  ],
};
