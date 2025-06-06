// Importaciones necesarias desde Angular y otras librerías
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // (No se usa en este componente, se puede eliminar)
import { Injectable } from '@angular/core'; // (No se usa en este componente, se puede eliminar)
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from 'app/services/projects/projects.service'; // Servicio para proyectos
import { MatSnackBar } from '@angular/material/snack-bar'; // Notificaciones tipo toast
import { MatDatepickerModule } from '@angular/material/datepicker'; // No se usa pero preparado si se necesita una fecha
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2'; // Librería para alertas bonitas
import { UsersService } from 'app/services/users/users.service'; // Servicio para usuarios
import { AuthService } from '@core/service/auth.service'; // Servicio de autenticación

// Decorador del componente con su configuración
@Component({
  selector: 'app-modal-create-project', // Nombre del componente
  standalone: true, // Es un componente independiente
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
  templateUrl: './modal-create-project.component.html', // Ruta de la plantilla HTML
  styleUrls: ['./modal-create-project.component.scss'] // Ruta de los estilos SCSS
})

// Clase del componente
export class ModalCreateProjectComponent implements OnInit {
  formCreateProject!: FormGroup; // Formulario reactivo para crear proyectos
  administratorsValues: any[] = []; // Lista de administradores para el dropdown
  statusOptions: string[] = ['active', 'inactive', 'completed']; // Opciones de estado (no usadas en este modal aún)

  // Constructor donde se inyectan los servicios
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Datos inyectados al modal (si vienen)
    private readonly _formBuilder: FormBuilder, // Constructor de formularios
    private readonly _projectService: ProjectsService, // Servicio de proyectos
    private readonly _dialogRef: MatDialogRef<ModalCreateProjectComponent>, // Referencia al modal
    private readonly _snackBar: MatSnackBar, // Servicio de notificaciones
    private readonly _authService: AuthService, // Servicio de autenticación
    private readonly _userService: UsersService // Servicio de usuarios
  ) {
    this.createFormProjects(); // Se inicializa el formulario al crear el componente
  }

  // Ciclo de vida que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.getAllAdministrator(); // Llamada para obtener los administradores
  }

  // Función que construye el formulario con sus validaciones
  createFormProjects() {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', Validators.required], // Campo requerido
      descripcion: ['', Validators.required], // Campo requerido
      administrador_id: ['', Validators.required] // Campo requerido
    });
  }

  // Llama al servicio para obtener todos los administradores
  getAllAdministrator() {
    this._userService.getAllAdministrator().subscribe({
      next: (res) => {
        console.log('Respuesta administradores:', res); // Se muestra en consola la respuesta
        this.administratorsValues = res.users; // Se guarda la lista de usuarios
      },
      error: (err) => {
        console.error(err); // En caso de error se imprime en consola
      }
    });
  }

  // Función que se ejecuta al hacer clic en "Crear"
  onSubmit() {
    // Si el formulario no es válido, se muestra una alerta de error
    if (this.formCreateProject.invalid) {
      Swal.fire('Error', 'Por favor completa los campos requeridos', 'error');
      return;
    }

    // Se construye el objeto con los datos del formulario
    const projectData = {
      nombre: this.formCreateProject.get('nombre')?.value,
      descripcion: this.formCreateProject.get('descripcion')?.value,
      administrador_id: this.formCreateProject.get('administrador_id')?.value
    };

    // Se llama al servicio para crear el proyecto
    this._projectService.createProject(projectData).subscribe({
      next: (response) => {
        // Si es exitoso, muestra notificación y cierra el modal
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this._dialogRef.close(true); // Devuelve true para indicar éxito
      },
      error: (error) => {
        // Si hay un error, muestra mensaje personalizado o uno por defecto
        const errorMessage = error.error?.message || 'Ocurrió un error al crear el proyecto. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
