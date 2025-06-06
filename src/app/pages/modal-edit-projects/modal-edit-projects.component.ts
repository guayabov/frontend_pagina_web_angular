// Importaciones necesarias desde Angular, Angular Material y servicios personalizados
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectsService } from 'app/services/projects/projects.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Decorador que define el componente standalone
@Component({
  selector: 'app-modal-edit-projects',
  standalone: true,
  // Módulos que se importan para el funcionamiento del componente
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  // Ruta al archivo HTML y SCSS del componente
  templateUrl: './modal-edit-projects.component.html',
  styleUrls: ['./modal-edit-projects.component.scss']
})

// Clase del componente
export class ModalEditProjectsComponent {
  // Formulario reactivo para editar el proyecto
  formUpdateProjects!: FormGroup;
 
  // Constructor con inyecciones de dependencias necesarias
  constructor(
    // Datos inyectados desde el componente padre (ej. datos del proyecto a editar)
    @Inject(MAT_DIALOG_DATA) public data: any,
    // Constructor de formularios
    private readonly _formBuilder: FormBuilder,
    // Servicio para mostrar mensajes emergentes
    private readonly _snackBar: MatSnackBar,
    // Servicio para interactuar con el backend de proyectos
    private readonly _projectService: ProjectsService,
    // Referencia al diálogo para poder cerrarlo manualmente
    private readonly dialogRef: MatDialogRef<ModalEditProjectsComponent>
  ) {
    // Inicializa el formulario cuando se construye el componente
    this.updateFormProjects();
  }

  // Hook de ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit() {
    // Si se pasan datos del proyecto, se cargan en el formulario
    if (this.data?.project) {
      this.loadProjectData(this.data.project);
    }
  }

  // Método para inicializar los campos del formulario reactivo con validaciones
  updateFormProjects() {
    this.formUpdateProjects = this._formBuilder.group({
      nombre: ['', Validators.required],        // Campo obligatorio
      descripcion: ['', Validators.required]    // Campo obligatorio
    });
  }

  // Carga los datos del proyecto existente en el formulario
  loadProjectData(project: any) {
    this.formUpdateProjects.patchValue({
      nombre: project.nombre,
      descripcion: project.descripcion,
    });
  }

  // Método que se ejecuta al hacer clic en el botón de actualizar
  updateProject() {
    // Solo se ejecuta si el formulario es válido
    if (this.formUpdateProjects.valid) {
      const projectData = this.formUpdateProjects.value;     // Obtiene los datos del formulario
      const projectId = this.data?.project?.id;              // Obtiene el ID del proyecto a actualizar

      // Llama al servicio para actualizar el proyecto
      this._projectService.updateProject(projectId, projectData).subscribe({
        // Si la respuesta es exitosa, muestra mensaje y cierra el diálogo
        next: (response) => {
          this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
          this.dialogRef.close(true);  // Cierra el modal y envía 'true' al componente padre
        },
        // En caso de error, muestra un mensaje de error
        error: (error) => {
          const errorMessage = error.error?.result || 'Ocurrió un error al actualizar el proyecto. Por favor, intenta nuevamente.';
          this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}
