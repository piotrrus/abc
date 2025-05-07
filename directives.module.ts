import { NgModule } from '@angular/core';
import { FirstUpperDirective } from '@shared/directives/first-upper.directive';
import { NoSpecialCharactersEmailDirective } from '@shared/directives/no-special-characters-email.directive';
import { NoSpecialCharactersPhoneNrDirective } from '@shared/directives/no-special-characters-phone-nr.directive';
import { NoSpecialCharactersPostalDirective } from '@shared/directives/no-special-characters-postal-code.directive';
import { NoSpecialCharactersDirective } from '@shared/directives/no-special-characters.directive';
import { NumberOnlyDirective } from '@shared/directives/number-only.directive';
import { PreventLettersDirective } from '@shared/directives/prevent-letters.directive';
import { TextAndNumberDirective } from '@shared/directives/text-and-numbers.directive';
import { TextOnlyDirective } from '@shared/directives/text-only.directive';
import { TrimDirective } from '@shared/directives/trim.directive';

const DIRECTIVES = [
     FirstUpperDirective,
     TextAndNumberDirective,
     NoSpecialCharactersDirective,
     NoSpecialCharactersEmailDirective,
     NumberOnlyDirective,
     NoSpecialCharactersPostalDirective,
     TrimDirective,
     NoSpecialCharactersPhoneNrDirective,
     TextOnlyDirective,
     PreventLettersDirective,
];
@NgModule({
     declarations: [DIRECTIVES],
     exports: [DIRECTIVES],
})
export class DirectivesModule {}
