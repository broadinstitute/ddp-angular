import { FormSectionDef } from '../core/formSectionDef';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBlockDef } from '../core/formBlockDef';
import { SectionIcon } from '../core/sectionIcon';
import { Template } from '../core/template';
import { IdentifiableFormBlockDef } from './identifiableFormBlockDef';

export class ObservableFormSectionDef implements FormSectionDef {
    blocksSubjects: Array<BehaviorSubject<IdentifiableFormBlockDef>> = [];
    icons: Array<SectionIcon>;
    nameTemplate: Template | null;
    sectionCode: string;

    constructor(section: FormSectionDef) {
        this.icons = section.icons;
        this.nameTemplate = section.nameTemplate;
        this.sectionCode = section.sectionCode;
    }

    get blocksObservables(): Array<Observable<IdentifiableFormBlockDef>> {
        return this.blocksSubjects.map(each => each.asObservable());
    }

    set identifiableBlocks(blocks: IdentifiableFormBlockDef[]) {
        this.blocksSubjects = blocks.map(block => new BehaviorSubject(block));
    }

    get blocks(): IdentifiableFormBlockDef[] {
        return this.blocksSubjects.map(obs => obs.value);
    }

    addBlock(block: IdentifiableFormBlockDef): BehaviorSubject<FormBlockDef> {
        const newBlockSubject = new BehaviorSubject(block);
        this.blocksSubjects.push(newBlockSubject);
        return newBlockSubject;
    }
    findBlockSubjectById(id: string): BehaviorSubject<IdentifiableFormBlockDef> | undefined {
        return this.blocksSubjects.find(subj => subj.value.id === id);
    }

    deleteBlock(block: IdentifiableFormBlockDef): boolean {
        const subjectToDelete = this.findBlockSubjectById(block.id);
        const i = this.blocksSubjects.indexOf(subjectToDelete as BehaviorSubject<IdentifiableFormBlockDef>);
        if (i >= 0) {
            this.blocksSubjects = this.blocksSubjects.splice(i);
            return true;
        }
        return false;
    }
}
