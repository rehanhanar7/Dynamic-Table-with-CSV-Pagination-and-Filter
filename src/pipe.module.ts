import { NgModule } from '@angular/core';
import { SearchFilterPipe } from './search.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [SearchFilterPipe],
  exports: [SearchFilterPipe],
})
export class ApplicationPipesModule {}
