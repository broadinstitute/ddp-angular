import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { StudyMessage } from '../models/StudyMessage';

/**
 * Mocking and delay is for development purposes
 * until proper backend interaction is set up
 */

@Injectable({
  providedIn: 'root',
})
export class StudyMessagesService {
  getMessages(): Observable<StudyMessage[]> {
    return of(this.mockMessages()).pipe(delay(3000));
  }

  private mockMessages(): StudyMessage[] {
    return [
      {
        date: new Date('03-01-2021'),
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description:
          'Maecenas vulputate enim est, eget dignissim libero dignissim ut.',
        additionalMessage:
          'Phasellus ligula orci, pretium in ipsum eget, sollicitudin eleifend nisl. Ut maximus felis ut ante faucibus ultrices. Suspendisse quis commodo eros. Aenean neque nunc, mattis vitae consequat quis, aliquet sit amet nisi. Mauris mollis posuere ligula sed cursus. Mauris sed dictum libero. Sed aliquam urna id mollis scelerisque.',
      },
      {
        date: new Date('03-02-2021'),
        title: 'Integer vehicula dignissim dui, vel feugiat magna.',
        description: 'Praesent aliquam erat sit amet bibendum rhoncus.',
        additionalMessage:
          'Sed auctor ullamcorper sem, ut rutrum lorem aliquet id. Mauris et iaculis ligula, ut eleifend turpis. Donec id purus eget ante varius gravida sed sit amet lorem. Curabitur eu urna tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eleifend fringilla tincidunt. Donec quam libero, molestie dapibus bibendum eu, lobortis non metus. Nam ultricies sapien quis lacus imperdiet, ac scelerisque lectus vulputate. Integer nisi odio, malesuada id nulla et, rutrum cursus dui. Suspendisse tincidunt ligula ac nisl efficitur fermentum. Morbi non ultrices nisl. Donec ornare dictum neque, ut mattis libero porttitor luctus. Duis a turpis non mauris sodales sodales.',
      },
      {
        date: new Date('03-03-2021'),
        title: 'In pulvinar eleifend condimentum.',
        description: 'Donec tincidunt cursus lorem lacinia scelerisque.',
        additionalMessage:
          'Aliquam in gravida nulla. Vivamus eu iaculis est, mattis pellentesque massa. Nam mattis dui ut ultricies bibendum. Proin non neque at nisi lacinia egestas. Vestibulum faucibus molestie leo, et sollicitudin tellus sagittis vitae. Aenean fringilla at elit a semper. Aenean ac sem ornare, porttitor purus quis, malesuada nunc. Maecenas ut euismod libero. Nulla tincidunt vulputate metus, sed iaculis mauris finibus quis. Duis eget neque vitae tortor fermentum viverra. Suspendisse eu arcu fermentum, efficitur augue at, congue justo. Maecenas rutrum turpis non euismod sagittis. Suspendisse dictum aliquam eleifend. Fusce ac mi ornare, pulvinar ligula vel, molestie enim.',
      },
      {
        date: new Date('03-04-2021'),
        title: 'Curabitur et rutrum urna.',
        description: 'Morbi finibus urna et pharetra interdum.',
        additionalMessage:
          'Proin nulla mi, hendrerit at metus in, ultricies rhoncus neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id magna eros. Nulla molestie efficitur venenatis. Quisque ut ultrices justo, sit amet pretium augue. Duis at tortor eu augue mattis lacinia a in lorem. Vestibulum facilisis lacus eros, vitae porttitor lacus aliquet eget. Sed viverra fringilla nisl, vel ultricies metus rhoncus sed.',
      },
      {
        date: new Date('03-05-2021'),
        title: 'Sed vulputate efficitur libero ut ullamcorper.',
        description:
          'Sed laoreet risus vitae odio dignissim, eu suscipit felis rutrum.',
        additionalMessage:
          'Praesent odio turpis, lacinia in convallis non, condimentum non orci. Quisque ut venenatis erat. Morbi non viverra diam. Vestibulum condimentum ornare nunc sed vulputate. Donec congue urna quis erat consectetur, ut vestibulum sem pellentesque. Nulla at auctor ante. Quisque bibendum felis libero, sed imperdiet arcu fermentum ut. Sed ligula mi, faucibus nec maximus at, scelerisque ac lectus. Suspendisse ultricies vel nisl sit amet condimentum.',
      },
      {
        date: new Date('03-06-2021'),
        title: 'Test',
        description: 'Test description',
        additionalMessage: `
          <p>Thank you for your interest in the Rare Genomes Project. Our team has reviewed the application you submitted, and unfortunately, you, or the person you applied on behalf of, are not eligible for the study at this time.</p>
          <p>The Rare Genomes Project is a research study aimed at understanding the genetic causes of rare and undiagnosed conditions in families. Our expertise and the focus of this project is using genomic approaches to find cases where genetic changes in a single gene result in a medical condition. There are a number of situations where our approach is not likely to be successful. Due to this, we are not able to enroll all families who have applied. Some reasons for this include, but are not limited to, families that have:</p>
          <ul>
            <li>
              Family members with very different medical conditions
            </li>
            <li>
              A condition which is not likely to be caused by a change in a single gene
            </li>
            <li>
              A condition where genomic sequencing is not the best test to use for diagnosis
            </li>
            <li>
              Already received a genetic diagnosis
            </li>
          </ul>
          <p>Following is a list of advocacy groups and resources that may  provide additional guidance for your family, including other research studies that are available. If your family is looking for support, we recommend reaching out to some of our advocacy partners, such as:</p>
          <ul>
            <li>
              National Organization for Rare Disorders (NORD; https://rarediseases.org/)
            </li>
          </ul>
          <p>The National Organization for Rare Disorders (NORD) is the leading independent advocacy organization dedicated to improving the lives of patients and families afflicted by a rare disease. Families looking for information on rare diseases, genetic testing, financial assistance programs, clinical trials, and more, are encouraged to contact NORD.</p>
          <ul>
            <li>
              Rare & Undiagnosed Network (RUN; https://rareundiagnosed.org/)
            </li>
          </ul>
          <p>RUN stands for Rare & Undiagnosed Network, a group of advocates, patients, families, researchers, and healthcare providers who share the same mission to bring genome sequencing into clinical practice to help undiagnosed patients and better understand rare conditions.</p>
          <ul>
            <li>
              U.R. Our Hope (http://urourhope.org/)
            </li>
          </ul>
          <p>U.R. Our Hope is a non-profit organization that assists individuals and their families on their journey to diagnosis and helps them navigate the healthcare system with a rare diagnosis. Their mission is to serve individuals with undiagnosed and rare disorders through education, advocacy, and support in order to bring hope through knowledge, empowerment, and healing. They assist families in the United States and beyond.</p>
          <ul>
            <li>
              MyGene2 (https://mygene2.org/MyGene2/)
            </li>
          </ul>
          <p>If your family already has a genetic diagnosis or candidate gene(s) for a genetic diagnosis and is looking to connect with other families and researchers, we recommend joining MyGene2, a family registry through which families with rare genetic conditions who are interested in publicly sharing health and genetic information or in seeking a genetic diagnosis can connect with other families, clinicians, and researchers.</p>
          <ul>
            <li>
              Global Genes (https://globalgenes.org)
            </li>
          </ul>
          <p>Global Genes is a non-profit, rare disease patient advocacy organization that promotes the needs of the rare disease community. Their mission is to “build awareness, educate the global community, and provide critical connections and resources that equip advocates to become activists for their disease."</p>
          <ul>
            <li>
              Genetics Home Reference (https://ghr.nlm.nih.gov)
            </li>
          </ul>
          <p>Genetics Home Reference is a federally funded resource of information about genetics and the role of genes in human disease.</p>
          <ul>
            <li>
              Clinicaltrials.gov (https://clinicaltrials.gov)
            </li>
          </ul>
          <p>This is a federally funded database of privately and publicly funded research studies from around the world. Visitors are able to search by disease name or symptoms as well as gene(s) of interest.</p>
          <p>Thank you again for your interest in our study. If you have any questions for our team, please email us at: raregenomes@broadinstitute.org, or call us at 617-714-7395.</p>`,
      },
    ];
  }
}
