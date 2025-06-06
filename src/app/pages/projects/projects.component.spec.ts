// Importa las utilidades necesarias para las pruebas unitarias de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente que será probado
import { ProjectsComponent } from './projects.component';

// Define el bloque de pruebas para el componente ProjectsComponent
describe('ProjectsComponent', () => {
  // Declaración de variables para el componente y su fixture (entorno de prueba)
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  // Se ejecuta antes de cada prueba; configura y compila el módulo de prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Se importa el componente que se va a testear
      imports: [ProjectsComponent]
    })
    // Compila los componentes declarados en el módulo de prueba
    .compileComponents();

    // Crea una instancia del componente en el entorno de prueba
    fixture = TestBed.createComponent(ProjectsComponent);
    // Obtiene la instancia del componente para manipularlo y hacer pruebas
    component = fixture.componentInstance;
    // Detecta cambios en el componente para que Angular actualice la vista
    fixture.detectChanges();
  });

  // Caso de prueba que verifica que el componente se crea correctamente
  it('should create', () => {
    // Espera que la instancia del componente sea verdadera (no sea nula ni indefinida)
    expect(component).toBeTruthy();
  });
});
