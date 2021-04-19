package com.icde.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Review.
 */
@Document(collection = "review")
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("rate")
    private Integer rate;

    @Field("desc")
    private String desc;

    @DBRef
    @Field("professors")
    private Set<Professor> professors = new HashSet<>();

    @DBRef
    @Field("courses")
    private Set<Courses> courses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Review id(String id) {
        this.id = id;
        return this;
    }

    public Integer getRate() {
        return this.rate;
    }

    public Review rate(Integer rate) {
        this.rate = rate;
        return this;
    }

    public void setRate(Integer rate) {
        this.rate = rate;
    }

    public String getDesc() {
        return this.desc;
    }

    public Review desc(String desc) {
        this.desc = desc;
        return this;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Set<Professor> getProfessors() {
        return this.professors;
    }

    public Review professors(Set<Professor> professors) {
        this.setProfessors(professors);
        return this;
    }

    public Review addProfessor(Professor professor) {
        this.professors.add(professor);
        return this;
    }

    public Review removeProfessor(Professor professor) {
        this.professors.remove(professor);
        return this;
    }

    public void setProfessors(Set<Professor> professors) {
        this.professors = professors;
    }

    public Set<Courses> getCourses() {
        return this.courses;
    }

    public Review courses(Set<Courses> courses) {
        this.setCourses(courses);
        return this;
    }

    public Review addCourses(Courses courses) {
        this.courses.add(courses);
        return this;
    }

    public Review removeCourses(Courses courses) {
        this.courses.remove(courses);
        return this;
    }

    public void setCourses(Set<Courses> courses) {
        this.courses = courses;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Review)) {
            return false;
        }
        return id != null && id.equals(((Review) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Review{" +
            "id=" + getId() +
            ", rate=" + getRate() +
            ", desc='" + getDesc() + "'" +
            "}";
    }
}
